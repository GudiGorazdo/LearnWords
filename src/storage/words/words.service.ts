import { SQLiteDatabase } from 'react-native-sqlite-storage';
import IConfig from '../../config/config.interface';
import SConfig from '../../config/config.service';
import ISwords from './words.service';
import IDB from '../db/db.interface';
import SDB from '../db/db.service';

export default class SWords implements ISwords {
	private static instance: ISwords;
	private tableName: string;
	private db: SQLiteDatabase | null = null;

	private structure = [
		'id INTEGER PRIMARY KEY AUTOINCREMENT',
		'word TEXT',
		'meaning TEXT',
		'correct INTEGER',
		'incorrect INTEGER',
	];

	constructor() {
		const config: IConfig = SConfig.getInstance();
		this.tableName = config.get('wordsTableName');
		this.init();
	}

	async init() {
		const instanceDB = await SDB.getInstance();
		this.db = await instanceDB.getDBConnection();
		await this.checkTable();
	}

	async dropTable() {
		try {
			const dropTableQuery = `DROP TABLE IF EXISTS ${this.tableName};`;
			await this.db.executeSql(dropTableQuery);
			console.log(`Таблица "${this.tableName}" успешно удалена`);
		} catch (error) {
			console.log('DROP ERR: ', error);''
		}
	}

	async checkTable() {
		const query = `CREATE TABLE IF NOT EXISTS ${this.tableName} (${this.structure.join(', ')});`
		try {
			await this.db.executeSql(query);
		} catch (error) {
			console.log('Ошибка при создании таблицы:', error);
		}
	}

	static getInstance() {
		if (SWords.instance) return SWords.instance;
		return SWords.instance = new SWords();
	}
}


