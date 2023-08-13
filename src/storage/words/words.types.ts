export type TTranslate = {
	[key: string]: number | string | string[] | undefined | boolean;
	value: string;
	context?: string[];
	word_id?: number,
	removed?: boolean,
	new?: boolean,
};

export type TWord = {
	[key: string]: number | string | undefined | TTranslate;
	id?: number,
	word: string,
	translate: TTranslate,
};


