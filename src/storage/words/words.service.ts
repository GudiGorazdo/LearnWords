import { SQLiteDatabase, ResultSet, Transaction } from 'react-native-sqlite-storage';
import ISwords from './words.service';
import SDB from '../db/db.service';

import { TWord, TTranslate } from './words.types';

type structureTable = {
	[key: string]: string | string[],
	tableName: string,
	structure: string[],
};

export default class SWords implements ISwords {
	private static instance: ISwords;
	private db: SQLiteDatabase | null = null;

	private structureWordsTable = {
		tableName: 'words',
		structure: [
			'id INTEGER PRIMARY KEY AUTOINCREMENT',
			'word TEXT',
			'correct INTEGER DEFAULT 0',
			'incorrect INTEGER DEFAULT 0',
		],
	}

	private structureTranslateTable = {
		tableName: 'word_translate',
		structure: [
			'id INTEGER PRIMARY KEY AUTOINCREMENT',
			'word_id  INTEGER',
			'translate TEXT',
			'context TEXT',
			'FOREIGN KEY (word_id) REFERENCES words(id)'
		]
	};

	constructor() { }

	async init() {
		const instanceDB = await SDB.getInstance();
		this.db = await instanceDB.getDBConnection();
		[
			this.structureWordsTable,
			this.structureTranslateTable,
		].forEach(async table => {
			await this.checkTable(table);
		});
	}

	static async getAllWords(callback: (words: TWord[]) => void) {
		const instance = await SWords.getInstance();
		instance.db.transaction((tx: Transaction) => {
			tx.executeSql(
				'SELECT * FROM words',
				[],
				(tx: Transaction, results: ResultSet) => {
					const len = results.rows.length;
					const words = [];

					for (let i = 0; i < len; i++) {
						const row = results.rows.item(i);
						words.push(row);
					}

					callback(words);
				},
				(error: any) => {
					console.error(error);
					callback([]);
				}
			);
		});
	}

	static async getByID(id: number, callback: (word: TWord | null) => void) {
		const instance = await SWords.getInstance();
		instance.db.transaction((tx: Transaction) => {
			tx.executeSql(
				'SELECT words.*, word_translate.id as t_id, word_translate.translate, word_translate.context FROM words left join word_translate on words.id=word_translate.word_id where words.id=(?)',
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

						callback(word);
					} else {
						callback(null);
					}
				},
				(error: any) => {
					console.error(error);
					callback(null);
				}
			);
		});
	}

	static async saveWord(word: TWord) {
		if (word.word === '') return;
		const instance = await SWords.getInstance();
		instance.db.transaction((tx: Transaction) => {
			tx.executeSql(
				`SELECT id FROM words where word=(?)`,
				[word.word],
				(tx: Transaction, results: ResultSet) => {
					if (results.rows.length === 0) {
						SWords.insertWordAndTranslations(tx, word);
					} else {
						console.log(`Запись с словом ${word.word} уже существует`);
					}
				},
				(error: any) => {
					console.error(error);
				}
			);
		});
	}

	private static insertWordAndTranslations(tx: Transaction, word: TWord) {
		tx.executeSql(
			'INSERT INTO words (word) VALUES (?)',
			[word.word],
			(tx: Transaction, results: ResultSet) => {
				const insertedWordId: number = results.insertId;

				if (word.translate && Array.isArray(word.translate)) {
					word.translate.forEach((translateData: TTranslate) => {
						SWords.insertTranslation(tx, translateData, insertedWordId);
					});
				}
			},
			(error: any) => {
				console.error(error);
			}
		);
	}

	private static insertTranslation(tx: Transaction, translate: TTranslate, insertedWordId: number) {
		const { context, value } = translate;
		const contextJson: string = JSON.stringify(context);
		tx.executeSql(
			'INSERT INTO word_translate (word_id, translate, context) VALUES (?, ?, ?)',
			[insertedWordId, value, contextJson],
			(tx: Transaction, results: ResultSet) => {
			},
			(error: any) => {
				console.error(error);
			}
		);
	}

	static async updateWord(word: TWord) {
		if (word.word === '') return;
		const instance = await SWords.getInstance();
		instance.db.transaction((tx: Transaction) => {
			tx.executeSql(
				'UPDATE words SET word = ? WHERE id = ?',
				[word.word, word.id],
				() => {
					if (word.translate && Array.isArray(word.translate)) {
						word.translate.forEach((translateData: TTranslate) => {
							const { id, context, value } = translateData;
							const contextJson: string = JSON.stringify(context);

							if (translateData.new) {
								SWords.insertTranslation(tx, translateData, word.id);
							} else if (translateData.removed) {
								tx.executeSql(
									'DELETE FROM word_translate WHERE id = ?',
									[id],
									() => { console.log(`Translation deleted.`); },
									(error: any) => {
										console.error(error);
									}
								);

							} else {
								tx.executeSql(
									'UPDATE word_translate SET translate = ?, context = ? WHERE id = ?',
									[value, contextJson, id],
									() => {
										console.log(`Word ${word.word} updated.`);
									},
									(error: any) => {
										console.error(error);
									}
								);
							}
						});
					}
				},
				(error: any) => {
					console.error(error);
				}
			);
		});
	}

	static async removeWordByID(id: number) {
		const instance = await SWords.getInstance();
		instance.db.transaction((tx: Transaction) => {
			tx.executeSql(
				'DELETE FROM word_translate WHERE word_id = ?',
				[id],
				(tx: Transaction, results: ResultSet) => {
					console.log(`Word with ID ${id} has been deleted from word_translate table.`);
				},
				(error: any) => {
					console.error(error);
				}
			);
			tx.executeSql(
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

	async dropTable(table: structureTable) {
		try {
			const dropTableQuery = `DROP TABLE IF EXISTS ${table.tableName};`;
			await this.db.executeSql(dropTableQuery);
			console.log(`Таблица "${table.tableName}" успешно удалена`);
		} catch (error) {
			console.log('DROP ERR: ', error); ''
		}
	}

	async checkTable(table: structureTable) {
		const query = `CREATE TABLE IF NOT EXISTS ${table.tableName} (${table.structure.join(', ')});`
		try {
			await this.db.executeSql(query);
			console.log('words table is ok.');
		} catch (error) {
			console.log('Ошибка при создании таблицы:', error);
		}
	}

	static async getInstance() {
		if (SWords.instance) return SWords.instance;
		SWords.instance = new SWords();
		await SWords.instance.init();
		return SWords.instance;
	}
}


