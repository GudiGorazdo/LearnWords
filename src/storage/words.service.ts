import sqlite3 from 'sqlite3';
import IConfig from '../config/config.interface';
import ISwords from './words.service';

// import app from '../provider/appProvider';
import Application from '../Application';

export default class SWords implements ISwords {
	// private source: sqlite3.Database;

	constructor() {
		const app = Application.getInstance();
		// const config: IConfig = app.resolve('config');
		// console.log(config.get('databaseName'))
		// this.source = new sqlite3.Database(config.get('databaseName'));
		// console.log(this.source);
		this.init();
	}

	init() {

	}
}


