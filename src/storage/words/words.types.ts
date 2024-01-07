import Realm from 'realm';
import Word from '../../store/models/Word';

export type TGroup = {
  name: string;
  _id: Realm.BSON.ObjectId;
  description?: string;
  count?: number;
};

export type TContenxt = {
  [key: string]: any;
  _id?: Realm.BSON.ObjectId;
  value: string;
}

export type TTranslate = {
  [key: string]: any;
  _id?: Realm.BSON.ObjectId;
  value: string;
  context?: TContenxt[];
  word: Word|null;
  removed?: boolean;
  new?: boolean;
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
