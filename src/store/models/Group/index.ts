import Realm from 'realm';
import Word from '../Word';

export default class Group extends Realm.Object<Group> {
  _id!: Realm.BSON.ObjectId;
  name!: 'string';
  words?: Realm.List<Word>;

  static schema: Realm.ObjectSchema = {
    name: 'Group',
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
      name: {type: 'string', indexed: true},
      words: 'Word[]',
    },
  };
}
