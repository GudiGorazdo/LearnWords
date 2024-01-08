import Realm from "realm";
import { TGroup } from "../types";

const getFromJSON = async () => {
  try {
    const data = await require('../assets/startDB/basic.json');
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const setup = async (realm: Realm) => {
  const data: TGroup[] = await getFromJSON();
  try {
    realm.write(() => {
      realm.create('Config', { isInstalled: true });

      for (const item of data) {
        realm.create('Group',item);
      }
    });

    console.log('Installed');
  } catch (error) {
    console.error('Ошибка при установке', error);
  }
};

export default setup;
