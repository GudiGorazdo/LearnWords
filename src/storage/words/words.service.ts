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

	constructor() {
		const config: IConfig = SConfig.getInstance();
		this.tableName = config.get('wordsTableName');
		const instanceDB = SDB.getInstance();
		this.init(instanceDB);
	}

	async init(instanceDB: SDB) {
		this.db = await instanceDB.getDBConnection();
		console.log(this.db);
	}

	static getInstance() {
		if (SWords.instance) return SWords.instance;
		return SWords.instance = new SWords();
	}
}


