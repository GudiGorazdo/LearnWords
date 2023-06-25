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
		'word TEXT NOT NULL',
		'meaning TEXT NOT NULL',
		'correct INTEGER NOT NULL',
		'incorrect INTEGER NOT NULL',
	];

	constructor() {
		const config: IConfig = SConfig.getInstance();
		this.tableName = config.get('wordsTableName');
		const instanceDB = SDB.getInstance();
		this.init(instanceDB);
	}

	async init(instanceDB: SDB) {
		this.db = await instanceDB.getDBConnection();
		const x = await this.checkTable();
		console.log(x);
	}

	async checkTable() {
		const query = `CREATE TABLE IF NOT EXISTS ${this.tableName} (${this.structure.join(', ')});`
		try {
			const resultSet = await this.db.executeSql(query);
			const rowsAffected = resultSet.rowsAffected;
			const insertId = resultSet.insertId;
			console.log('Таблица успешно создана или уже существует');
			console.log('Затронуто строк:', rowsAffected);
			console.log('Последний вставленный идентификатор:', insertId);
		} catch (error) {
			console.log('Ошибка при создании таблицы:', error);
		}
	}

	static getInstance() {
		if (SWords.instance) return SWords.instance;
		return SWords.instance = new SWords();
	}
}


