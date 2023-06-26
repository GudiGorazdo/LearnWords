import IDB from './db.interface';
import SConfig from '../../config/config.service';
import IConfig from '../../config/config.interface';
import React from 'react-native';
import { openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';

export default class SDB implements IDB {
	private static instance: SDB;
	private DBName: string;
	private DBLocation: string;
	private connection: SQLiteDatabase | null = null;

	constructor() {
		const config: IConfig = SConfig.getInstance();
		this.DBName = config.get('databaseName');
		this.DBLocation = config.get('databaseLocation');

		this.init();
	}

	static getInstance() {
		if (SDB.instance) return SDB.instance;
		return SDB.instance = new SDB();
	}

	async init() {
		this.connection = await this.getDBConnection();
	}

	async getDBConnection(): Promise<SQLiteDatabase | null> {
		if (this.connection) return this.connection;
		return openDatabase({name: this.DBName, location: this.DBLocation}, this.connectSuccess, this.connectError);
	}

	connecterror(error: any) {
		throw new Error(error);
	}

	connectSuccess() {
		console.log('DB CONNECT SUCCCESS');
	}
}


