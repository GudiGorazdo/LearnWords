import Realm from "realm";
import { TTranslate, TWord } from "../types";
import Word from "./models/Word";

export const sync = (realm: Realm, word: Word, translates: TTranslate[]) => {}

export const update = (realm: Realm, word: Word, value: string, translates: TTranslate[] = []) => {
  const data: TWord = {
    ...word,
    value: value,
    translates: translates,
  };
  realm.create('Word', data, Realm.UpdateMode.Modified);
  sync(realm, word, translates);
}

