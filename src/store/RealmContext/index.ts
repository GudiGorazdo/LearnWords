import Realm from 'realm';
import { createRealmContext } from '@realm/react';
import Config from '../../store/models/Config';
import Group from '../../store/models/Group';
import Word from '../../store/models/Word';
import Translate from '../../store/models/Translate';
import Context from '../../store/models/Context';

const realmConfig: Realm.Configuration = {
  schema: [Config, Group, Word, Translate, Context],
};

const { RealmProvider, useRealm, useObject, useQuery } =
  createRealmContext(realmConfig);

export { RealmProvider, useRealm, useObject, useQuery };
