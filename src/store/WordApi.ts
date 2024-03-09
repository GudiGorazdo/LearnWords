import Realm from "realm";
import { TContext, TTranslate, TWord, TGroup } from "../types";
import Word from "./models/Word";
import Context from "./models/Context";
import Group from "./models/Group";

const getTranslatesToRemove = (word: Word, translates: TTranslate[]) => {
  const translateIds: string[] = translates.map(translate => translate._id?.toString() ?? '');
  return word.translates.filter(translate => {
    return translate._id && !translateIds.includes(translate._id.toString());
  });
}

const getContextsToRemove = (word: Word, translates: TTranslate[]) => {
  const newContextsIds: string[] = [];
  translates.map(translate => {
    translate.contexts?.map(context => {
      context._id && newContextsIds.push(context._id.toString());
    });
  });

  const filteredContexts: Context[] = [];
  word.translates.filter(translate => {
    translate.contexts?.map(context => {
      if (!newContextsIds.includes(context._id.toString())) {
        filteredContexts.push(context);
      }
    });
  });

  return filteredContexts;
}

const syncGroups = (word: Word, groups: Group[]) => {
  word.groups && word.groups.forEach(group => {
    if (!groups.includes(group) && group.words?.includes(word)) {
      const wordIndex = group.words?.indexOf(word);
      (wordIndex || wordIndex === 0) && group.words?.splice(wordIndex, 1);
    }
  });

  groups.forEach(group => {
    if (group.words?.includes(word)) return;
    group.words?.push(word);
  });
}

export const update = (
  realm: Realm,
  groups: Group[],
  word: Word,
  value: string,
  translates: TTranslate[]
) => {
  try {
    [
      getTranslatesToRemove(word, translates),
      getContextsToRemove(word, translates)
    ].forEach(intem => realm.delete(intem));
    syncGroups(word, groups);

    const data: TWord = {
      ...word,
      groups: groups,
      value: value,
      translates: translates,
    };
    realm.create('Word', data, Realm.UpdateMode.Modified);

    return true;
  } catch (error) {
    console.log('Ошибка src/store/WordApi update()', error);
    return false;
  }
}

export const create = (realm: Realm, word: TWord) => {
  try {
    const newWord: any = realm.create('Word', word);
    word.groups.forEach((group: Group) => {
      group.words?.push(newWord as Word);
    });

    return true;
  } catch (error) {
    console.log('Ошибка src/store/WordApi create()', error);
    return false;
  }
}

export const remove = (realm: Realm, word: Word) => {
  try {
    word.groups?.forEach(group => {
      const wordIndex = group.words?.indexOf(word);
      (wordIndex || wordIndex === 0) && group.words?.splice(wordIndex, 1);
    });

    word.translates.forEach(translate => {
      translate.contexts?.forEach(context => realm.delete(context));
      realm.delete(translate);
    });

    realm.delete(word);

    return true;
  } catch (error) {
    console.log('Ошибка src/store/WordApi remove()', error);
    return false;
  }
}
