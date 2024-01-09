import React, { useState, useRef, useEffect, } from 'react';
import { useRoute, useFocusEffect, } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Realm from 'realm';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Header } from '../../modules/Header';
import { Alert, TAlertButton } from '../../modules/Alert';
import { TTranslate, TWord, TContext, TGroup } from '../../types';
import Icon from 'react-native-vector-icons/Ionicons';
import IconsStrings from '../../assets/awesomeIcons';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { useObject, useRealm, useQuery } from '../../store/RealmContext';
import Word from '../../store/models/Word';
import Context from '../../store/models/Context';
import { Groups } from './Groups';
import { Translate } from './Translate';

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

export function WordEdit({ navigation }: IWordEditScreenProps): JSX.Element {
  const realm = useRealm();
  const route = useRoute();
  const isNewWord = (route.params as { isNewWord?: boolean })?.isNewWord;
  const wordID = (route.params as { wordID?: string })?.wordID;
  const word: any = useObject<Word>("Word", new Realm.BSON.ObjectId(wordID));
  // console.log(word.groups);
  // const x: any = useObject<Word>("Translate", new Realm.BSON.ObjectId('659ba2ba798f859f48e94e27'));
  // console.log('x', x);

  realm.write(() => {

    // if (word) word.translates = [];

    // word.groups = [];
    // word.groups.push(groups[1]);
    // if (word && !word.groups.includes(groups[1])) {
    // }
    // groups[1].words?.push(word);
  });
  // console.log(word.translates[0]._id); // 659ba2ba798f859f48e94e27
  // console.log(word.groups.includes(groups[0]));
  // console.log([... new Set(word.groups)]);
  // console.log(groups[1].words);

  const emptyInputTranslate: TTranslate = {
    contexts: [],
    value: '',
  };

  const [inputWord, setInputWord] = useState(word?.value ?? '');
  const [inputTranslate, setInputTranslate] = useState<TTranslate[]>(inputsTranslateInitialState(word) ?? [emptyInputTranslate]);

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
    newInputTranslate[index].removed = true;
    setInputTranslate(newInputTranslate);
  };

  const handleLayout = () => {
    if (!startScroll) {
      setScrollBottom(true);
    }
  };

  // const updateWord = async (word: TWord) => {
  //   word.id = wordID;
  //   // await SWords.update(word);
  // };

  const validationWord = (): boolean => {
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

    return false;
  };

  const filterinputTranslate = () => {
    // const filteredinputTranslate: TTranslate[] = inputTranslate.reduce(
    //   (acc: TTranslate[], item: TTranslate) => {
    //     if (item.value == '') {
    //       return acc;
    //     }
    //     if (item.context) {
    //       item.context = item.context.filter(contextItem => contextItem !== '');
    //     }
    //     acc.push(item);
    //     return acc;
    //   },
    //   [],
    // );
    // setInputTranslate(filteredinputTranslate);
    // return filteredinputTranslate;
  };

  // const dbSaveWord = async (word: TWord) => {
  //   return new Promise(async (resolve, reject) => {
  //     let result = null;
  //     if (isNewWord) {
  //       // result = await SWords.save(word);
  //     } else {
  //       result = await updateWord(word);
  //     }

  //     resolve(result);
  //   });
  // };

  const updateWord = () => {
    const data: TWord = {
      ...word,
      value: inputWord,
      translates: inputTranslate,
    };
    realm.create('Word', data, Realm.UpdateMode.Modified);
  }

  const createWord = () => {
    // const data: TWord = {

    // };
  }

  const saveWord = async () => {
    if (validationWord()) {
      return;
    }
    realm.write(() => {
      if (word) {
        updateWord();
      } else {
        createWord();
      }
      // inputTranslate.forEach((translate: TTranslate) => {
      //   console.log('save');
      //   console.log(translate);
      //   const update = word?.translates.filter((old) => old);
      //   // translate.contexts.forEach((context: TContext) => {
      //   //   console.log(context);
      //   // });
      // });
    });
    // const inputsData = filterinputTranslate();

    // const word: TWord = {
    //   word: inputWord,
    //   translate: inputsData,
    // };

    // setSaveWordError(false);
    // setAlertMessage('Слово сохранено');
    // try {
    //   const result = await dbSaveWord(word);
    //   if (result === 'duplicate') {
    //     setAlertMessage('Слово уже есть в словаре');
    //   }
    //   setAlertVisible(true);
    // } catch (error: any) {
    //   console.log(error);
    //   setAlertMessage('При сохранении слова произошла ошибка');
    //   return setAlertVisible(true);
    // }
  };

  const resetForm = () => {
    // setInputTranslate([emptyInputTranslate]);
    // setInputWord('');
  };

  const getAlertButtons = (): TAlertButton[] => {
    const buttons: TAlertButton[] = [{
      title: 'Закрыть',
      onPress: () => {
        setAlertVisible(!isAlertVisible);
        // setStart(true);
      },
    }];

    // if (isSaveWordError) return buttons;

    // if (isNewWord) {
    //   buttons.push({
    //     title: 'Добавить новое слово',
    //     onPress: () => {
    //       setAlertVisible(!isAlertVisible);
    //       resetForm();
    //       setStart(true);
    //       navigation.push('WordEdit', {
    //         isNewWord: true,
    //       });
    //     },
    //   });
    // }
    // buttons.push({
    //   title: 'Назад',
    //   onPress: () => {
    //     setAlertVisible(!isAlertVisible);
    //     setStart(true);
    //     navigation.goBack();
    //   },
    // });

    // buttons.push({
    //   title: 'К списку слов',
    //   onPress: () => {
    //     setAlertVisible(!isAlertVisible);
    //     setStart(true);
    //     navigation.navigate('WordsList', { groupID: groupID});
    //   },
    // });

    return buttons;
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <Header
          backPath={() => {
            // setStart(true);
            navigation.goBack();
          }}
          accept={() => saveWord()}
        />
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
              <Groups word={word} />
              <Input
                style={[styles.mb]}
                label="Слово"
                placeholder="Введите слово"
                value={inputWord}
                onChangeText={value => setInputWord(value)}
              />
              {inputTranslate.map((data, index) =>
                data.removed ? null : (
                  <Translate
                    key={`translate-${index}`}
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
        isVisible={isAlertVisible}
        message={alertMessage}
        buttons={getAlertButtons()}
        onOverlayPress={() => setAlertVisible(!isAlertVisible)}
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


