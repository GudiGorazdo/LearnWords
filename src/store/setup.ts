import Realm from "realm";
import { TGroup } from "../types";
import { TWord } from "../types";

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

      for (const group of data) {
        const groupItem = realm.create('Group', { name: group.name });
        group.words && group.words.forEach((word) => {
          realm.create('Word', {
            value: word.value,
            translates: word.translates,
            groups: [groupItem]
          });
        });
      }
    });

    console.log('Installed');
  } catch (error) {
    console.error('Ошибка при установке', error);
  }
};

export default setup;
