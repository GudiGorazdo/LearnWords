export type TAppConfig = {
	[key: string]: string,
	databaseName: string,
	wordsTable: string,
};

const AppConfig: TAppConfig = {
	// DATABASE
	databaseName: 'LWords',
	wordsTable: 'words'
}

export default AppConfig;
