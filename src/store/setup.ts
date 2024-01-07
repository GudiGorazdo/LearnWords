const getFromJSON = async () => {
  try {
    const data = await require('../assets/startDB/basic.json');
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createContext = (realm, item, translate) => {
  const context = realm.create('Context', {
    value: item,
    translate: translate,
  });

  return context;
};

const createTranslate = (realm, item, word) => {
  const translate = realm.create('Translate', {
    value: item.value,
    group: word,
  });

  const contexts = [];
  for (const context of item.context) {
    contexts.push(createContext(realm, context, translate));
  }

  realm.create(
    'Translate',
    {_id: translate._id, contexts: contexts},
    'modified',
  );

  return translate;
};

const createWord = (realm, item, group) => {
  const word = realm.create('Word', {
    value: item.word,
    group: group,
  });

  const translates = [];
  for (const translate of item.translate) {
    translates.push(createTranslate(realm, translate, word));
  }

  realm.create('Word', {_id: word._id, translates: translates}, 'modified');

  return word;
};

const setup = async realm => {
  const data = await getFromJSON();
  try {
    for (const item of data) {
      realm.write(() => {
        const group = realm.create('Group', {
          name: item.group,
        });

        const words = [];
        for (const word of item.words) {
          words.push(createWord(realm, word, group));
        }

        realm.create('Group', {_id: group._id, words: words}, 'modified');
      });
    }

    realm.write(() => {
      realm.create('Config', {isInstalled: true});
    });

    console.log('Installed');
  } catch (error) {
    console.error('Ошибка при установке', error);
  }
};

export default setup;
