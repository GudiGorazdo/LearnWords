import Realm from 'realm';
// import Word from '../Word';
import Context from '../Context';

export default class Translate extends Realm.Object<Translate> {
  _id!: Realm.BSON.ObjectId;
  value!: string;
  // word!: Word;
  contexts?: Realm.List<Context>;

  static schema: Realm.ObjectSchema = {
    name: 'Translate',
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
      value: {type: 'string', indexed: true},
      contexts: 'Context[]',
      word: 'Word',
    },
  };
}
