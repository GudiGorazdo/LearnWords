import Realm from 'realm';
import Group from './store/models/Group';
import Word from './store/models/Word';
import Translate from './store/models/Translate';
import Context from './store/models/Context';

export type TGroup = {
  _id: Realm.BSON.ObjectId;
  name: string;
  words?: TWord[] | Word[];
};

export type TWord = {
  [key: string]: any;
  _id?: Realm.BSON.ObjectId;
  value: string;
  translates?: TTranslate[] | Translate[];
  group?: TGroup | Group;
};

export type TWordListItem = {
  id: string;
  value: string;
};

export type TTranslate = {
  [key: string]: any;
  _id?: Realm.BSON.ObjectId;
  value: string;
  contexts?: TContext[] | Context[];
};


export type TContext = {
  [key: string]: any;
  _id?: Realm.BSON.ObjectId;
  value: string;
}


