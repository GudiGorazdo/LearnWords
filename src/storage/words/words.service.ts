import { SQLiteDatabase, ResultSet, Transaction } from 'react-native-sqlite-storage';
import ISwords from './words.service';
import SDB from '../db/db.service';

import { TWord, TTranslate, TGroup } from './words.types';
import { KeyboardAvoidingViewBase } from 'react-native';


type TStructureTable = {
  [key: string]: string | string[],
  name: string,
  structure: string[],
};

type TStartDB = { data: TWord[], groups: number[] };

export default class SWords implements ISwords {
  private static instance: ISwords;
  private db: SQLiteDatabase | null = null;

  private tables: TStructureTable[] = [
    {
      name: 'words',
      structure: [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'word TEXT',
        'correct INTEGER DEFAULT 0',
        'incorrect INTEGER DEFAULT 0',
      ],
    },
    {
      name: 'word_translate',
      structure: [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'word_id  INTEGER',
        'translate TEXT',
        'context TEXT',
        'FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE',
      ]
    },
    {
      name: 'groups',
      structure: [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'name TEXT',
        'description TEXT NULL',
      ]
    },
    {
      name: 'word_group',
      structure: [
        'word_id INTEGER',
        'group_id  INTEGER',
        'translate TEXT',
        'context TEXT',
        'FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE',
        'FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE',
        'PRIMARY KEY (group_id, word_id)',
      ]
    },
  ]

  constructor() { }

  private async init() {
    const instanceDB = await SDB.getInstance();
    this.db = await instanceDB.getDBConnection();
    // await this.reset();
    this.tables.forEach(async table => {
      await this.checkTable(table);
    });
  }

  private static async execute(sql: string, params: Array<any> = []): Promise<ResultSet> {
    const instance = await SWords.getInstance();
    return new Promise(async (resolve, reject) => {
      try {
        instance.db.transaction((tx: Transaction) => {
          tx.executeSql(sql, params,
            (tx: Transaction, results: ResultSet) => {
              resolve(results)
            },
            (error: any) => {
              reject(error);
              console.error(error);
            }
          );
        });
      } catch (error: any) {
        reject(error);
        console.log(error);
      }
    });
  }

  static async getDictionaryCount(): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const results: ResultSet = await SWords.execute(`SELECT COUNT(id) as count FROM words`);
        const result = results.rows.item(0);
        if (result) resolve(result.count);
        else reject(0)
      } catch (error: any) {
        reject(error);
        console.log(error);
      }
    });
  }

  static async getWithoutGroupsCount(): Promise<number> {
    const sql = `
							SELECT COUNT(words.id) as count
							FROM words
							LEFT JOIN word_group ON word_group.word_id = words.id
							WHERE word_group.word_id IS NULL
						`;
    return new Promise(async (resolve, reject) => {
      try {
        const results: ResultSet = await SWords.execute(sql);
        const result = results.rows.item(0);
        if (result) resolve(result.count);
        else reject(0)
      } catch (error: any) {
        reject(error);
        console.log(error);
      }
    });
  }

  static async getWordsList(groups?: number | number[] | 'null'): Promise<TWord[]> {
    let sql = `
					SELECT 
						words.*,
						groups.name as group_name,
						groups.id as group_id,
						groups.description as group_description
					FROM words
					LEFT JOIN word_group ON word_group.word_id = words.id
					LEFT JOIN groups ON groups.id = word_group.group_id
				`;
    if (groups) {
      if (Array.isArray(groups)) {
        groups = groups.join(' ,');
        sql += ` WHERE groups.id IN (${groups})`;
      }
      if (typeof groups === "number") {
        sql += ` WHERE groups.id = ${groups}`;
      }
      if (groups === 'null') {
        sql += ` WHERE word_group.word_id IS NULL`;
      }
    }

    return new Promise<TWord[]>(async (resolve, reject) => {
      try {
        const results: ResultSet = await SWords.execute(sql);
        const len = results.rows.length;
        const words: TWord[] = [];

        for (let i = 0; i < len; i++) {
          const row = results.rows.item(i);
          words.push(row);
        }
        resolve(words);
      } catch (error) {
        reject(error);
        console.log(error);
      }
    });
  }

  private static createWordData(results: ResultSet): TWord {
    const wordTranslations: TTranslate[] = SWords.createTranslationData(results);
    const word: TWord = {
      id: results.rows.item(0).id,
      word: results.rows.item(0).word,
      translate: wordTranslations,
    };

    return word;
  }

  private static createTranslationData(results: ResultSet): TTranslate[] {
    const wordTranslations: TTranslate[] = [];

    for (let i = 0; i < results.rows.length; i++) {
      const result = results.rows.item(i);
      const translation: TTranslate = {
        id: result.t_id,
        value: result.translate,
        context: JSON.parse(result.context),
      };
      wordTranslations.push(translation);
    }

    return wordTranslations;
  }

  static getRandom(): Promise<TWord | null> {
    const sql = `
						SELECT words.*, 
							word_translate.id as t_id, 
							word_translate.translate, 
							word_translate.context
						FROM words 
						LEFT JOIN word_translate on words.id=word_translate.word_id 
						ORDER BY RANDOM() 
						LIMIT 1
					;`

    return new Promise<TWord | null>(async (resolve, reject) => {
      try {
        const results: ResultSet = await SWords.execute(sql);
        const word: TWord = SWords.createWordData(results);
        resolve(word);
      } catch (error) {
        reject(error);
        console.log(error);
      }
    });
  }

  static getNextWordInGroup(wordID: number, groupID: number, order: 'next' | 'prev'): Promise<TWord | null> {
    const sql = `
						SELECT 
              words.*, 
              word_translate.id as t_id, 
              word_translate.translate, 
              word_translate.context 
            FROM words 
            LEFT JOIN word_translate ON words.id = word_translate.word_id 
            ${groupID ? `
              LEFT JOIN word_group ON word_group.word_id = words.id
              LEFT JOIN groups ON groups.id = word_group.group_id
            ` : ''}
            WHERE  
              ${groupID ? `groups.id = (?) AND` : ''}
              words.word COLLATE NOCASE ${order === 'next' ? '>' : '<'} (SELECT words.word FROM words WHERE id = ?)
            ORDER BY words.word COLLATE NOCASE ${order === 'next' ? 'ASC' : 'DESC'}
            LIMIT 1
					;`;
    const params = groupID ? [groupID, wordID] : [wordID];

    return new Promise<TWord | null>(async (resolve, reject) => {
      try {
        const results: ResultSet = await SWords.execute(sql, params);
        if (results.rows.length > 0) {
          const word: TWord = SWords.createWordData(results);
          resolve(word);
        } else {
          resolve(null);
        }
      } catch (error) {
        reject(error);
        console.log(error);
      }
    });
  }

  static getExtremeWordInGroup(groupID: number, extreme: 'first' | 'last'): Promise<TWord | null> {
    const sql = `
						SELECT 
              words.*, 
              word_translate.id as t_id, 
              word_translate.translate, 
              word_translate.context 
            FROM words 
            LEFT JOIN word_translate ON words.id = word_translate.word_id 
            ${groupID ? `
              LEFT JOIN word_group ON word_group.word_id = words.id
              LEFT JOIN groups ON groups.id = word_group.group_id
              WHERE groups.id = (?)
            ` : ''}
            ORDER BY words.word ${extreme === 'first' ? 'ASC' : 'DESC'}
            LIMIT 1
					;`;
    const params = groupID ? [groupID] : [];

    return new Promise<TWord | null>(async (resolve, reject) => {
      try {
        const results: ResultSet = await SWords.execute(sql, params);
        if (results.rows.length > 0) {
          const word: TWord = SWords.createWordData(results);
          resolve(word);
        } else {
          resolve(null);
        }
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  static getRandomAnswers(wordID: number): Promise<TTranslate[]> {
    const sql = `
						SELECT *
						FROM word_translate 
						WHERE word_id <> (?) 
						ORDER BY RANDOM() LIMIT 5
					;`;
    const params = [wordID];

    return new Promise<TTranslate[]>(async (resolve, reject) => {
      try {
        const results: ResultSet = await SWords.execute(sql, params);
        if (results.rows.length > 0) {
          const wordTranslations: TTranslate[] = SWords.createTranslationData(results);
          resolve(wordTranslations);
        } else {
          resolve([]);
        }
      } catch (error) {
        reject(error);
        console.log(error)
      }
    });
  }

  static getByID(id: number): Promise<TWord | null> {
    const sql = `
						SELECT 
							words.*, 
							word_translate.id as t_id, 
							word_translate.translate, 
							word_translate.context 
						FROM words left join word_translate on words.id=word_translate.word_id 
						where words.id=(?)
					;`;
    const params = [id];

    return new Promise<TWord | null>(async (resolve, reject) => {
      try {
        const results: ResultSet = await SWords.execute(sql, params);
        if (results.rows.length > 0) {
          const word: TWord = SWords.createWordData(results);
          resolve(word);
        } else {
          resolve(null);
        }
      } catch (error) {
        reject(error);
        console.log(error)
      }
    });
  }

  static async save(word: TWord): Promise<string> {
    const sql = `SELECT id FROM words where word=(?)`;
    const params = [word.word];

    return new Promise<string>(async (resolve, reject) => {
      try {
        const results: ResultSet = await SWords.execute(sql, params);
        if (results.rows.length === 0) {
          try {
            await SWords.insertWordAndTranslations(word);
            resolve('ok');
          } catch (error: any) {
            resolve('error');
          }
        } else {
          resolve('dublicate');
        }
      } catch (error) {
        reject(error);
        console.log(error);
      }
    });
  }

  private static async insertWordAndTranslations(word: TWord): Promise<boolean> {
    const sql = 'INSERT INTO words (word) VALUES (?)';
    const params = [word.word];

    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const results: ResultSet = await SWords.execute(sql, params);
        const insertedWordID: number = results.insertId;

        if (word.groups) {
          word.groups.forEach(async (group: number) => {
            await SWords.insertGroup(group, insertedWordID);
          });
        }

        if (word.translate && Array.isArray(word.translate)) {
          word.translate.forEach(async (translateData: TTranslate) => {
            if (translateData.value > '') {
              await SWords.insertTranslation(translateData, insertedWordID);
            }
          });
        }

        resolve(true);
      } catch (error) {
        reject(error);
        console.log(error);
      }
    });
  }

  private static async insertTranslation(translate: TTranslate, insertedWordId: number) {
    const sql = 'INSERT INTO word_translate (word_id, translate, context) VALUES (?, ?, ?)';
    let { context, value } = translate;
    context = context && context.filter(item => item !== '');
    const contextJson: string = JSON.stringify(context);
    const params = [insertedWordId, value, contextJson];
    try {
      const results: ResultSet = await SWords.execute(sql, params);
      return results;
    } catch (error) {
      throw error;
    }
  }

  private static async updateWord(word: TWord): Promise<ResultSet> {
    const sql = 'UPDATE words SET word = ? WHERE id = ?';
    const params = [word.word, word.id];
    return SWords.execute(sql, params);
  }

  private static async updateTranslation(translateData: TTranslate): Promise<ResultSet> {
    const sql = 'UPDATE word_translate SET translate = ?, context = ? WHERE id = ?';
    const contextJson: string = JSON.stringify(translateData?.context?.filter(item => item !== ''));
    const params = [translateData.value, contextJson, translateData.id];
    return SWords.execute(sql, params);
  }

  private static async deleteTranslation(translateData: TTranslate): Promise<ResultSet> {
    const sql = 'DELETE FROM word_translate WHERE id = ?';
    return SWords.execute(sql, [translateData.id]);
  }

  static async update(word: TWord): Promise<boolean> {
    if (word.word === '') return false;

    try {
      await SWords.updateWord(word);

      if (word.translate && Array.isArray(word.translate)) {
        const promises = word.translate.map(async (translateData: TTranslate) => {
          if (translateData.new && word.id) {
            await SWords.insertTranslation(translateData, word.id);
          } else if (translateData.removed) {
            await SWords.deleteTranslation(translateData);
          } else {
            await SWords.updateTranslation(translateData);
          }
        });

        await Promise.all(promises);
        return true;
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static async removeByID(id: number) {
    try {
      await SWords.execute('DELETE FROM word_translate WHERE word_id = ?', [id]);
      console.log(`Word with ID ${id} has been deleted from word_translate table.`);
      await SWords.execute('DELETE FROM words WHERE id = ?', [id]);
      console.log(`Word with ID ${id} has been deleted from words table.`);
    } catch (error) {
      throw error;
    }
  }

  static async getGroups(): Promise<TGroup[]> {
    const sql = ` 
						SELECT 
							groups.*, 
							COUNT(words.id) AS count
						FROM groups
						LEFT JOIN word_group ON groups.id = word_group.group_id
						LEFT JOIN words ON word_group.word_id = words.id
						GROUP BY groups.id
					;`;

    return new Promise<TGroup[]>(async (resolve, reject) => {
      try {
        const results: ResultSet = await SWords.execute(sql);
        const groups: TGroup[] = [];
        for (let i = 0; i < results.rows.length; i++) {
          const result = results.rows.item(i) as TGroup;
          const group: TGroup = {
            id: result.id,
            description: result.description ?? undefined,
            name: result.name,
            count: result.count,
          }
          groups.push(group);
        }
        resolve(groups);
      } catch (error) {
        reject(error);
        console.log(error);
      }
    });
  }

  static async createGroup(name: string, description?: string): Promise<string | number> {
    const selectQuery = 'SELECT COUNT(*) AS count FROM groups WHERE name = ?';
    const selectParams = [name];
    const insertQuery = 'INSERT INTO groups (name, description) VALUES (?, ?)';
    const insertParams = [name, description ?? null];

    return new Promise<string | number>(async (resolve, reject) => {
      try {
        const resultsSelect: ResultSet = await SWords.execute(selectQuery, selectParams);
        const count = resultsSelect.rows.item(0).count;
        if (count > 0) {
          resolve('duplicate');
        } else {
          const resultsInsert: ResultSet = await SWords.execute(insertQuery, insertParams);
          if (resultsInsert.insertId) resolve(resultsInsert.insertId);
        }
      } catch (error) {
        reject(error);
        console.log(error);
      }
    });
  }

  private static async insertGroup(groupID: number, wordID: number) {
    const sql = 'INSERT INTO word_group (group_id, word_id) VALUES (?, ?)';
    const params = [groupID, wordID];
    try {
      await SWords.execute(sql, params);
      console.log(`word ${wordID} added to ${groupID} group`);
    } catch (error) {
      throw error;
    }
  }

  private async dropTable(table: TStructureTable) {
    try {
      const dropTableQuery = `DROP TABLE IF EXISTS ${table.name};`;
      await this.db.executeSql(dropTableQuery);
      console.log(`Таблица "${table.name}" успешно удалена`);
    } catch (error) {
      console.log('DROP ERR: ', error); ''
    }
  }

  private async checkTable(table: TStructureTable) {
    const query = `CREATE TABLE IF NOT EXISTS ${table.name} (${table.structure.join(', ')});`
    try {
      await this.db.executeSql(query);
      console.log(table.name, ' table is ok.');
    } catch (error) {
      console.log('Ошибка при создании таблицы:', error);
    }
  }

  private async reset() {
    for (const table of this.tables) {
      await this.dropTable(table);
      await this.checkTable(table);
    }

    try {
      const result: TStartDB = await this.getFromJSON();
      for (const word of result.data) {
        word.groups = result.groups;
        await SWords.save(word);
      }
    } catch (error: any) {
      console.log('error');
      console.log(error);
    }
  }

  private getFromJSON(): Promise<TStartDB> {
    return new Promise<TStartDB>(async (resolve, reject) => {
      try {
        const data: TWord[] = await require('../../assets/startDB/basic.json');
        const groupIDResult = await SWords.createGroup('Первая группа');
        let groupID: number = 0;
        if (typeof groupIDResult === 'number') groupID = groupIDResult;
        const result: TStartDB = { data: data, groups: [groupID] };
        resolve(result)
      } catch (error: any) {
        reject({})
      }
    });
  }

  static async getInstance() {
    if (SWords.instance) return SWords.instance;
    SWords.instance = new SWords();
    await SWords.instance.init();
    return SWords.instance;
  }

}


