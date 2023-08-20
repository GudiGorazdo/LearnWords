import { SQLiteDatabase, ResultSet, Transaction } from 'react-native-sqlite-storage';
import ISwords from './words.service';
import SDB from '../db/db.service';

import { TWord, TTranslate, TGroup } from './words.types';


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

	static async getDictionaryCount(): Promise<number> {
		const instance = await SWords.getInstance();
		return new Promise(async (resolve, reject) => {
			try {
				instance.db.transaction((tx: Transaction) => {
					tx.executeSql(`SELECT COUNT(id) as count FROM words`,
						[],
						(tx: Transaction, results: ResultSet) => {
							const result = results.rows.item(0);
							if (result) resolve(result.count);
							else reject(0)
						},
						(error: any) => {
							console.error(error);
						}
					);
				});
			} catch (error: any) {
				console.log(error);
			}
		});
	}

	static async getWithoutGroupsCount(): Promise<number> {
		const instance = await SWords.getInstance();
		return new Promise(async (resolve, reject) => {
			try {
				instance.db.transaction((tx: Transaction) => {
					tx.executeSql(`
							SELECT COUNT(words.id) as count
							FROM words
							LEFT JOIN word_group ON word_group.word_id = words.id
							WHERE word_group.word_id IS NULL
						`,
						[],
						(tx: Transaction, results: ResultSet) => {
							const result = results.rows.item(0);
							console.log(result);
							if (result) resolve(result.count);
							else reject(0)
						},
						(error: any) => {
							console.error(error);
						}
					);
				});
			} catch (error: any) {
				console.log(error);
			}
		});
	}

	static async getWordsList(groups?: number | number[] | 'null'): Promise<TWord[]> {
		return new Promise<TWord[]>(async (resolve, reject) => {
			const instance = await SWords.getInstance();
			instance.db.transaction((tx: Transaction) => {
				let sqlQuery = `
					SELECT 
						words.*,
						groups.id as group_id,
						groups.name as group_name,
						groups.description as group_description
					FROM words
					LEFT JOIN word_group ON word_group.word_id = words.id
					LEFT JOIN groups ON groups.id = word_group.group_id
				`;
				if (groups) {
					if (Array.isArray(groups)) {
						groups = groups.join(' ,');
						sqlQuery += ` WHERE groups.id IN (${groups})`;
					}
					if (typeof groups === "number") {
						sqlQuery += ` WHERE groups.id = ${groups}`;
					}
					if (groups === 'null') {
						sqlQuery += ` WHERE word_group.word_id IS NULL`;
					}
				}
				tx.executeSql(
					sqlQuery,
					[],
					(tx: Transaction, results: ResultSet) => {
						const len = results.rows.length;
						const words: TWord[] = [];

						for (let i = 0; i < len; i++) {
							const row = results.rows.item(i);
							words.push(row);
						}

						resolve(words);
					},
					(error: any) => {
						console.error(error);
						reject(error);
					}
				);
			});
		});
	}

	static getRandom(): Promise<TWord | null> {
		return new Promise<TWord | null>(async (resolve, reject) => {
			const instance = await SWords.getInstance();
			instance.db.transaction((tx: Transaction) => {
				tx.executeSql(`
						SELECT words.*, 
							word_translate.id as t_id, 
							word_translate.translate, 
							word_translate.context
						FROM words 
						left join word_translate on words.id=word_translate.word_id 
						ORDER BY RANDOM() 
						LIMIT 1
					;`,
					[],
					(tx: Transaction, results: ResultSet) => {
						if (results.rows.length > 0) {
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

							const word: TWord = {
								id: results.rows.item(0).id,
								word: results.rows.item(0).word,
								translate: wordTranslations,
							};

							resolve(word);
						} else {
							resolve(null);
						}
					},
					(error: any) => {
						console.error(error);
						reject(error);
					}
				);
			});
		});
	}

	static getRandomAnswers(wordID: number): Promise<TTranslate[]> {
		return new Promise<TTranslate[]>(async (resolve, reject) => {
			const instance = await SWords.getInstance();
			instance.db.transaction((tx: Transaction) => {
				tx.executeSql(`
						SELECT *
						FROM word_translate 
						WHERE word_id <> (?) 
						ORDER BY RANDOM() LIMIT 5
					;`,
					[wordID],
					(tx: Transaction, results: ResultSet) => {
						if (results.rows.length > 0) {
							const wordTranslations: TTranslate[] = [];

							for (let i = 0; i < results.rows.length; i++) {
								const result = results.rows.item(i);
								const translation: TTranslate = {
									id: result.id,
									value: result.translate,
									context: JSON.parse(result.context),
								};
								wordTranslations.push(translation);
							}

							resolve(wordTranslations);
						} else {
							const wordTranslations: TTranslate[] = [];
							resolve(wordTranslations);
						}
					},
					(error: any) => {
						console.error(error);
						reject(error);
					}
				);
			});
		});
	}

	static getByID(id: number): Promise<TWord | null> {
		return new Promise<TWord | null>(async (resolve, reject) => {
			const instance = await SWords.getInstance();
			instance.db.transaction((tx: Transaction) => {
				tx.executeSql(`
						SELECT 
							words.*, 
							word_translate.id as t_id, 
							word_translate.translate, 
							word_translate.context 
						FROM words left join word_translate on words.id=word_translate.word_id 
						where words.id=(?)
					`,
					[id],
					(tx: Transaction, results: ResultSet) => {
						if (results.rows.length > 0) {
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

							const word: TWord = {
								id: results.rows.item(0).id,
								word: results.rows.item(0).word,
								translate: wordTranslations,
							};

							resolve(word);
						} else {
							resolve(null);
						}
					},
					(error: any) => {
						console.error(error);
						reject(error);
					}
				);
			});
		});
	}

	static async save(word: TWord): Promise<string> {
		const instance = await SWords.getInstance();
		return new Promise<string>(async (resolve, reject) => {
			await instance.db.transaction(async (tx: Transaction) => {
				await tx.executeSql(
					`SELECT id FROM words where word=(?)`,
					[word.word],
					async (tx: Transaction, results: ResultSet) => {
						if (results.rows.length === 0) {
							try {
								await instance.insertWordAndTranslations(word);
								resolve('ok');
							} catch (error: any) {
								resolve('error');
							}
						} else {
							resolve('dublicate');
						}
					},
					(error: any) => {
						console.error(error);
						reject('error');
					}
				);
			});
		});
	}

	private async insertWordAndTranslations(word: TWord): Promise<boolean> {
		const instance = await SWords.getInstance();
		return new Promise<boolean>(async (resolve, reject) => {
			await instance.db.transaction(async (tx: Transaction) => {
				await tx.executeSql(
					'INSERT INTO words (word) VALUES (?)',
					[word.word],
					async (tx: Transaction, results: ResultSet) => {
						try {
							const insertedWordID: number = results.insertId;

							if (word.groups) {
								word.groups.forEach(async (group: number) => {
									await instance.insertGroup(tx, group, insertedWordID);
								});
							}

							if (word.translate && Array.isArray(word.translate)) {
								word.translate.forEach(async (translateData: TTranslate) => {
									if (translateData.value > '') {
										await instance.insertTranslation(tx, translateData, insertedWordID);
									}
								});
							}

							resolve(true);
						} catch (error: any) {
							console.log(error);
							reject(false);
						}
					},
					(error: any) => {
						console.error(error);
					}
				);
			});
		});
	}

	private async insertTranslation(tx: Transaction, translate: TTranslate, insertedWordId: number) {
		let { context, value } = translate;
		context = context && context.filter(item => item !== '');
		const contextJson: string = JSON.stringify(context);
		await tx.executeSql(
			'INSERT INTO word_translate (word_id, translate, context) VALUES (?, ?, ?)',
			[insertedWordId, value, contextJson],
			(tx: Transaction, results: ResultSet) => {
			},
			(error: any) => {
				console.error(error);
			}
		);
	}

	static async update(word: TWord): Promise<boolean> {
		if (word.word === '') return false;

		return new Promise<boolean>(async (resolve, reject) => {
			const instance = await SWords.getInstance();
			instance.db.transaction((tx: Transaction) => {
				tx.executeSql(
					'UPDATE words SET word = ? WHERE id = ?',
					[word.word, word.id],
					() => {
						if (word.translate && Array.isArray(word.translate)) {
							const promises = word.translate.map((translateData: TTranslate) => {
								return new Promise<void>((resolve, reject) => {
									let { id, context, value } = translateData;
									context = context && context.filter(item => item !== '');
									const contextJson: string = JSON.stringify(context);

									if (translateData.new && word.id) {
										instance.insertTranslation(tx, translateData, word.id)
											.then(() => resolve())
											.catch(error => reject(error));
									} else if (translateData.removed) {
										tx.executeSql(
											'DELETE FROM word_translate WHERE id = ?',
											[id],
											() => {
												console.log(`Translation deleted.`);
												resolve();
											},
											(error: any) => {
												console.error(error);
												reject(error);
											}
										);
									} else {
										tx.executeSql(
											'UPDATE word_translate SET translate = ?, context = ? WHERE id = ?',
											[value, contextJson, id],
											() => {
												console.log(`Word ${word.word} updated.`);
												resolve();
											},
											(error: any) => {
												console.error(error);
												reject(error);
											}
										);
									}
								});
							});

							Promise.all(promises)
								.then(() => resolve(true))
								.catch(error => {
									console.error(error);
									resolve(false);
								});
						} else {
							resolve(true);
						}
					},
					(error: any) => {
						console.error(error);
						resolve(false);
					}
				);
			});
		});
	}

	static async removeByID(id: number) {
		const instance = await SWords.getInstance();
		await instance.db.transaction(async (tx: Transaction) => {
			await tx.executeSql(
				'DELETE FROM word_translate WHERE word_id = ?',
				[id],
				(tx: Transaction, results: ResultSet) => {
					console.log(`Word with ID ${id} has been deleted from word_translate table.`);
				},
				(error: any) => {
					console.error(error);
				}
			);
			await tx.executeSql(
				'DELETE FROM words WHERE id = ?',
				[id],
				(tx: Transaction, results: ResultSet) => {
					console.log(`Word with ID ${id} has been deleted from words table.`);
				},
				(error: any) => {
					console.error(error);
				}
			);
		});
	}

	static async getGroups(): Promise<TGroup[]> {
		const instance = await SWords.getInstance();
		return new Promise<TGroup[]>(async (resolve, reject) => {
			await instance.db.transaction(async (tx: Transaction) => {
				tx.executeSql(` 
						SELECT 
							groups.*, 
							COUNT(words.id) AS count
						FROM groups
						LEFT JOIN word_group ON groups.id = word_group.group_id
						LEFT JOIN words ON word_group.word_id = words.id
						GROUP BY groups.id
					;`,
					[],
					(tx: Transaction, results: ResultSet) => {
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
					},
					(error: any) => {
						reject([]);
						console.error(error);
					}
				);
			});
		});
	}

	static async createGroup(name: string, description?: string): Promise<string | number> {
		const instance = await SWords.getInstance();
		return new Promise<string | number>(async (resolve, reject) => {
			await instance.db.transaction(async (tx: Transaction) => {
				const selectQuery = 'SELECT COUNT(*) AS count FROM groups WHERE name = ?';
				tx.executeSql(
					selectQuery,
					[name],
					(tx: Transaction, results: ResultSet) => {
						const count = results.rows.item(0).count;
						if (count > 0) {
							resolve('duplicate');
						} else {
							const insertQuery = 'INSERT INTO groups (name, description) VALUES (?, ?)';
							tx.executeSql(
								insertQuery,
								[name, description ?? null],
								(tx: Transaction, results: ResultSet) => {
									resolve(results.insertId);
								},
								(error: any) => {
									reject(error);
									console.error(error);
								}
							);
						}
					},
					(error: any) => {
						reject(error);
						console.error(error);
					}
				);
			});
		});
	}

	private async insertGroup(tx: Transaction, groupID: number, wordID: number) {
		await tx.executeSql(
			'INSERT INTO word_group (group_id, word_id) VALUES (?, ?)',
			[groupID, wordID],
			(tx: Transaction, results: ResultSet) => {
				console.log(`word ${wordID} added to ${groupID} group`);
			},
			(error: any) => {
				console.error(error);
			}
		);
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


