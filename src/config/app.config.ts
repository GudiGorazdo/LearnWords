export type TAppConfig = {
	[key: string]: string,
	databaseName: string,
	wordsTable: string,
};

const AppConfig: TAppConfig = {
	// DATABASE
	databaseName: 'LWords.db',
	wordsTable: 'words'
}

export default AppConfig;
