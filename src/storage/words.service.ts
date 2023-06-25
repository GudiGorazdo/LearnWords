import IConfig from '../config/config.interface';
import SConfig from '../config/config.service';
import ISwords from './words.service';

export default class SWords implements ISwords {
	private static instance: ISwords;

	constructor() {
		const config: IConfig = SConfig.getInstance();
		this.init();
	}

	init() {

	}

	static getInstance() {
		if (SWords.instance) return SWords.instance;
		return SWords.instance = new SWords();
	}
}


