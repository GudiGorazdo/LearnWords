export type TTranslate = {
	[key: string]: number | string | string[] | undefined;
	value: string;
	context?: string[];
	word_id?: number,
};

export type TWord = {
	[key: string]: number | string | undefined | TTranslate;
	id?: number,
	word: string,
	translate: TTranslate,
};


