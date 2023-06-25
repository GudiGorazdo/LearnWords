import sqlite3 from 'sqlite3';
import IConfig from '../config/config.interface';
import SConfig from '../config/config.service';
import ISwords from './words.service';

export default class SWords implements ISwords {
	private static instance: ISwords;
	// private source: sqlite3.Database;

	constructor() {
		const config: IConfig = SConfig.getInstance();
		// this.source = new sqlite3.Database(config.get('databaseName'));
		// console.log(this.source);
		this.init();
	}

	init() {

	}

	static getInstance() {
		if (SWords.instance) return SWords.instance;
		return SWords.instance = new SWords();
	}
}


