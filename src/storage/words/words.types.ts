export type TGroup = {
	name: string,
	id?: number,
	description?: string,
	count?: number,
}

export type TTranslate = {
	[key: string]: number | string | string[] | undefined | boolean;
	value: string;
	context?: string[];
	word_id?: number,
	removed?: boolean,
	new?: boolean,
};

export type TWord = {
	[key: string]: number | string | undefined | TTranslate[];
	word: string,
	translate: TTranslate[],
	id?: number,
	groups?: number[],
};


