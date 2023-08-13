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

	static async initC() {
		return 
	}

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

	getAllWords(callback: (words: TWord[]) => void) {
		this.db.transaction((tx: Transaction) => {
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

	async saveWord(word: TWord) {
		if (word.word === '') return;
		this.db.transaction((tx: Transaction) => {
			tx.executeSql(
				`SELECT id FROM words where word=(?)`,
				[word.word],
				(tx: Transaction, results: ResultSet) => {
					if (results.rows.length === 0) {
						this.insertWordAndTranslations(tx, word);
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

	insertWordAndTranslations(tx: Transaction, word: TWord) {
		tx.executeSql(
			'INSERT INTO words (word) VALUES (?)',
			[word.word],
			(tx: Transaction, results: ResultSet) => {
				const insertedWordId: number = results.insertId;

				if (word.translate && Array.isArray(word.translate)) {
					word.translate.forEach((translateData: TTranslate) => {
						const { context, value } = translateData;
						const contextJson: string = JSON.stringify(context);

						tx.executeSql(
							'INSERT INTO word_translate (word_id, translate, context) VALUES (?, ?, ?)',
							[insertedWordId, value, contextJson],
							(tx: Transaction, results: ResultSet) => {
								console.log(`Word ${word.word} added.`);
								console.log(results);
							},
							(error: any) => {
								console.error(error);
							}
						);
					});
				}
			},
			(error: any) => {
				console.error(error);
			}
		);
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


