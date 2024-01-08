import Realm from 'realm';
import Translate from '../Translate';

export default class Context extends Realm.Object<Context> {
  _id!: Realm.BSON.ObjectId;
  value!: string;
  translate!: Translate;

  static schema: Realm.ObjectSchema = {
    name: 'Context',
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
      value: {type: 'string', indexed: true},
      translate: {
        type: 'linkingObjects',
        objectType: 'Translate',
        property: 'contexts',
      },
    },
  };
}
