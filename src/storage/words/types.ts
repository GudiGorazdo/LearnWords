type TValue = {
	[key: string]: string,
	value: string,
}

export type TTranslate = TValue;

export type TContext = TValue[];

export type TWord = {
	word: string,
	translate: TContext,
};


