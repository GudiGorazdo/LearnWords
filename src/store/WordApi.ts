import Realm from "realm";
import { TContext, TTranslate, TWord } from "../types";
import Word from "./models/Word";
import Context from "./models/Context";

export const sync = (realm: Realm, word: Word, translates: TTranslate[]) => {
  const translateIds: string[] = translates.map(translate => translate._id?.toString() ?? '');
  const filteredTranslates = word.translates.filter(translate => {
    return translate._id && !translateIds.includes(translate._id.toString());
  });

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

  [filteredContexts, filteredTranslates].forEach(intem => realm.delete(intem));
}

export const update = (realm: Realm, word: Word, value: string, translates: TTranslate[] = []) => {
  sync(realm, word, translates);
  const data: TWord = {
    ...word,
    value: value,
    translates: translates,
  };
  realm.create('Word', data, Realm.UpdateMode.Modified);
}

export const create = (realm: Realm, word: TWord) => {
  // const data: TWord = {

  // };
}
