import Realm from 'realm';

export default class Config extends Realm.Object<Config> {
  isInstalled!: boolean;

  static schema: Realm.ObjectSchema = {
    name: 'Config',
    properties: {
      isInstalled: {type: 'bool', default: false},
    },
  };
}
