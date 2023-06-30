type TTranslate = {
	[key: string]: string | string[] | undefined;
	value: string;
	context?: string[];
};

export type TWord = {
	word: string,
	translate: TTranslate,
};


