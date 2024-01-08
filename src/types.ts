import Realm from 'realm';

export type TGroup = {
  _id: Realm.BSON.ObjectId;
  name: string;
  words: TWord[];
};

export type TWord = {
  [key: string]: any;
  _id?: Realm.BSON.ObjectId;
  value: string;
  translate: TTranslate[];
  group?: TGroup;
};

export type TWordListItem = {
  id: string;
  value: string;
};

export type TTranslate = {
  [key: string]: any;
  _id?: Realm.BSON.ObjectId;
  value: string;
  context: TContext[];
  removed?: boolean;
  new?: boolean;
};


export type TContext = {
  [key: string]: any;
  _id?: Realm.BSON.ObjectId;
  value: string;
}


