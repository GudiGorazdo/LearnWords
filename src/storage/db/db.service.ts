import IDB from './db.interface';
import SConfig from '../../config/config.service';
import IConfig from '../../config/config.interface';
import { openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';

export default class SDB implements IDB {
	private static instance: SDB;
	private DBName: string;
	private connection: SQLiteDatabase | null = null;

	constructor() {
		const config: IConfig = SConfig.getInstance();
		this.DBName = config.get('databaseName');
		this.init();
	}

	async init() {
		this.connection = await this.getDBConnection(this.DBName);
	}

	private async getDBConnection(name: string, location: string = 'default'): Promise<SQLiteDatabase | null> {
		return openDatabase({name: name, location: location});
	}

	static getInstance() {
		if (SDB.instance) return SDB.instance;
		return SDB.instance = new SDB();
	}
}


