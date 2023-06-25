import { IServiceContainerOptions } from '../provider/serviceContainer';
import ConfigService from './config.service';
import WordsService from '../storage/words.service';

export type TDependency = [string, any, IServiceContainerOptions];

export const dependencies: TDependency[] = [
	['config', new ConfigService(), { singleton: true }],
	['wordsService', new WordsService(), { singleton: true }],
];

