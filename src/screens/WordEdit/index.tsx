import React, { useState, useRef, useEffect, } from 'react';
import { useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Realm from 'realm';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Header } from '../../modules/Header';
import { TTranslate, TWord, TContext } from '../../types';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { useObject, useRealm, useQuery } from '../../store/RealmContext';
import Group from '../../store/models/Group';
import Word from '../../store/models/Word';
import Context from '../../store/models/Context';
import { Groups } from './Groups';
import { Translate } from './Translate';
import { Alert } from './Alert';
import * as WordApi from '../../store/WordApi';

import containerStyles from '../../styles/container';
import buttonBottomFreeze from '../../styles/buttonBottomFreeze';
import theme from '../../styles/themeLight';

import {
  SafeAreaView,
  View,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
} from 'react-native';

interface IWordEditScreenProps {
  navigation: StackNavigationProp<any>;
}

const inputsTranslateInitialState = (word: Word | null) => {
  return word?.translates.map((translate) => {
    const contexts: TContext[] | Context[] = translate.contexts?.map((context) => {
      return {
        _id: context._id,
        value: context.value,
      }
    }) ?? [];

    return {
      _id: translate._id,
      value: translate.value,
      contexts: contexts,
    }
  })
}

const emptyInputTranslate: TTranslate = {
  contexts: [],
  value: '',
};

export function WordEdit({ navigation }: IWordEditScreenProps): JSX.Element {
  const realm = useRealm();
  const route = useRoute();
  const isNewWord = (route.params as { isNewWord?: boolean })?.isNewWord;
  const wordID = (route.params as { wordID?: string })?.wordID;
  const word: Word | null = useObject<Word>("Word", new Realm.BSON.ObjectId(wordID));

  const [inputWord, setInputWord] = useState(word?.value ?? '');
  const [inputTranslate, setInputTranslate] = useState<TTranslate[]>(inputsTranslateInitialState(word) ?? [emptyInputTranslate]);
  const [groupsList, setGroupsList] = useState<Group[]>((word?.groups ?? []) as Group[]);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSaveWordError, setSaveWordError] = useState(false);
  const [startScroll, setStartScroll] = useState(true);
  const [scrollBottom, setScrollBottom] = useState(false);
  const scrollViewRef = useRef(null);


  useEffect(() => {
    if (scrollBottom && scrollViewRef && scrollViewRef.current) {
      (scrollViewRef.current as ScrollView).scrollToEnd({ animated: true });
      setScrollBottom(false);
    }
  }, [scrollBottom]);

  const updateInputGroups = (
    value: string,
    index: number,
    type: string,
    contextIndex?: number,
  ) => {
    setInputTranslate(prevInputGroups => {
      const newInputTranslate = [...prevInputGroups];
      switch (type) {
        case 'translate':
          newInputTranslate[index].value = value;
          break;
        case 'context':
          if (contextIndex !== 0 && !contextIndex) break;
          if (!newInputTranslate[index].contexts) break;
          const contexts = newInputTranslate[index].contexts;
          contexts && (contexts[contextIndex].value = value);
          break;
      }
      return newInputTranslate;
    });
  };

  const addNewContext = (index: number) => {
    const newInputTranslate = [...inputTranslate];
    if (newInputTranslate[index] && newInputTranslate[index].contexts) {
      newInputTranslate[index].contexts?.push({} as Context);
      setInputTranslate(newInputTranslate);
    }
  };

  const removeContext = (index: number, contextIndex: number) => {
    const newInputTranslate = [...inputTranslate];
    if (newInputTranslate[index] && newInputTranslate[index].contexts) {
      newInputTranslate[index].contexts?.splice(contextIndex, 1);
      setInputTranslate(newInputTranslate);
    }
  };

  const addNewTranslate = () => {
    const newInputTranslate = [...inputTranslate];
    newInputTranslate.push(emptyInputTranslate);
    setInputTranslate(newInputTranslate);
  };

  const removeTranslate = (index: number) => {
    const newInputTranslate = [...inputTranslate];
    newInputTranslate.splice(index, 1);
    setInputTranslate(newInputTranslate);
  };

  const handleLayout = () => {
    if (!startScroll) {
      setScrollBottom(true);
    }
  };

  const filterInputTranslate = () => {
    const filteredinputTranslate: TTranslate[] = inputTranslate.reduce(
      (acc: TTranslate[], item: TTranslate) => {
        if (item.value.trim() == '') {
          return acc;
        }
        if (item.contexts) {
          item.contexts = item.contexts.reduce((acc: TContext[], contextItem: TContext) => {
            contextItem.value = contextItem.value.trim();
            if (contextItem.value) acc.push(contextItem);
            return acc;
          }, [] as TContext[]);
        }
        acc.push(item);
        return acc;
      },
      [],
    );
    if (filteredinputTranslate.length < 1) {
      filteredinputTranslate.push(emptyInputTranslate);
    };
    setInputTranslate(filteredinputTranslate);
  };

  const validationWord = (): boolean => {
    const value = inputWord.trim();
    setInputWord(value);
    filterInputTranslate();

    if (!inputWord) {
      setSaveWordError(true);
      setAlertMessage('Введите слово');
      setAlertVisible(true);
      return true;
    }

    if (!inputTranslate[0].value) {
      setSaveWordError(true);
      setAlertMessage('Введите перевод');
      setAlertVisible(true);
      return true;
    }

    if (isNewWord && realm.objects("Word").filtered("value = $0", inputWord, false).length) {
      setSaveWordError(true);
      setAlertMessage('Слово уже есть в словаре');
      setAlertVisible(true);
      return true;
    }

    return false;
  };

  const saveWord = () => {
    return new Promise(resolve => {
      realm.write(() => {
        let result: boolean = false;

        if (isNewWord) {
          result = WordApi.create(realm, {
            value: inputWord,
            translates: inputTranslate,
          } as TWord);
        } else if (word) {
          result = WordApi.update(
            realm,
            groupsList,
            word,
            inputWord,
            inputTranslate
          );
        }

        resolve(result);
      });
    });
  };

  const submit = async () => {
    if (validationWord()) return;

    try {
      const result = await saveWord();
      console.log(result);
      if (!result) {
        throw Error('Произошла ошибка при сохраненни слова src/screens/WordEdit submit()');
      };

      setAlertMessage('Слово успешно сохранено');
      setSaveWordError(false);
      setAlertVisible(true);

    } catch (error) {
      console.log(error);
      setAlertMessage('При сохранении слова произошла ошибка');
      return setAlertVisible(true);
    }
  }

  const resetForm = () => {
    // setInputTranslate([emptyInputTranslate]);
    // setInputWord('');
  };


  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <Header backPath={() => navigation.goBack()} accept={() => submit()} />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? getStatusBarHeight(true) : 0}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={[styles.scrollViewContent, containerStyles]}
          >
            <View style={styles.section}>
              <Groups word={word} onChange={(list) => setGroupsList(list)} />
              <Input
                style={[styles.mb]}
                label="Слово"
                placeholder="Введите слово"
                value={inputWord}
                onChangeText={value => setInputWord(value)}
              />
              {inputTranslate.map((data, index) => (
                <Translate
                  key={`translate-${index}`}
                  translateIndex={index}
                  data={data}
                  containerStyle={styles.groupInputs}
                  inputStyle={styles.mb}
                  removeIcon={inputTranslate.length > 1}
                  onUpdateDataTranslate={(translate) => updateInputGroups(translate, index, 'translate')}
                  onUpdateDataContext={(context, contextIndex) => updateInputGroups(context, index, 'context', contextIndex)}
                  onLayout={() => handleLayout()}
                  removeGroup={() => removeTranslate(index)}
                  addContext={() => addNewContext(index)}
                  removeContext={(contextIndex) => removeContext(index, contextIndex)}
                />
              ),
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <Button
          style={buttonBottomFreeze}
          title="Добавить перевод"
          onPress={() => {
            setStartScroll(false);
            addNewTranslate();
          }}
        />
      </SafeAreaView>
      <Alert
        isNewWord={!!isNewWord}
        isVisible={isAlertVisible}
        alertMessage={alertMessage}
        isErrors={isSaveWordError}
        close={() => setAlertVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  mb: {
    marginBottom: 10,
  },

  safeArea: {
    flex: 1,
  },

  flex: {
    flex: 1,
  },

  text: {
    color: theme.textColor
  },

  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
  },

  wordRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  section: {
    width: '80%',
    paddingBottom: 30,
  },

  groupInputs: {
    marginBottom: 30,
    paddingBottom: 20,
    flexGrow: 1,
    borderBottomWidth: 1,
  },

  contextRow: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },

  removeContextIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    marginLeft: 10,
  },

  groupForm: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    paddingTop: 30,
    paddingBottom: 50,
    backgroundColor: 'white',
    zIndex: 100,
  },

  dropdown1BtnStyle: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },

  dropdown1BtnTxtStyle: { color: '#444', textAlign: 'left' },
  dropdown1DropdownStyle: { backgroundColor: '#EFEFEF' },
  dropdown1RowStyle: { backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' },
  dropdown1RowTxtStyle: { color: '#444', textAlign: 'left' },
});


