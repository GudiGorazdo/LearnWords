import React, {
  useState,
  useRef,
  useEffect,
} from 'react';
import {
  NavigationProp,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Header } from '../../modules/Header';
import { Alert, TAlertButton } from '../../modules/Alert';
import SWords from '../../storage/words/words.service';
import { TTranslate, TWord } from '../../storage/words/words.types';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconsStrings from '../../assets/awesomeIcons';
import SelectDropdown from 'react-native-select-dropdown';
import { BottomModalWindow } from '../../modules/BottomModalWindow';

import containerStyles from '../../styles/container';
import buttonBottomFreeze from '../../styles/buttonBottomFreeze';

import {
  SafeAreaView,
  View,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
} from 'react-native';

interface IWordEditScreenProps {
  navigation: NavigationProp<any>;
}

export function WordEdit({ navigation }: IWordEditScreenProps): JSX.Element {
  const route = useRoute();
  const isNewWord = route.params.isNewWord ?? false;
  const wordID = route.params.wordID ?? null;

  const inputDataGroup: TTranslate = {
    value: '',
    context: [],
    new: true,
  };

  const [isGroupListVisible, setGroupListVisible] = useState(false);
  const [start, setStart] = useState(true);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSaveWordError, setSaveWordError] = useState(false);
  const [inputWord, setInputWord] = useState('');
  const [inputsGroups, setInputsGroup] = useState<TTranslate[]>([inputDataGroup,]);
  const [startScroll, setStartScroll] = useState(true);
  const [scrollBottom, setScrollBottom] = useState(false);
  const scrollViewRef = useRef(null);
  useEffect(() => {
    if (scrollBottom && scrollViewRef && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
      setScrollBottom(false);
    }
  }, [scrollBottom]);

  useFocusEffect(() => {
    if (start) {
      fetchWord();
      setStart(false);
    }
  });

  const fetchWord = async () => {
    const word = await SWords.getByID(wordID);
    if (word) {
      setInputWord(word.word);
      setInputsGroup(word.translate);
    }
  };

  const updateInputGroups = (
    value: string,
    index: number,
    type: string,
    contextIndex?: number,
  ) => {
    setInputsGroup(prevInputGroups => {
      const newInputsGroups = [...prevInputGroups];
      switch (type) {
        case 'translate':
          newInputsGroups[index].value = value;
          break;
        case 'context':
          if (newInputsGroups[index].context && contextIndex !== undefined) {
            newInputsGroups[index].context[contextIndex] = value;
          }
          break;
      }
      return newInputsGroups;
    });
  };

  const addNewContext = (index: number) => {
    const newInputsGroups = [...inputsGroups];
    if (newInputsGroups[index] && newInputsGroups[index].context) {
      newInputsGroups[index].context.push('');
      setInputsGroup(newInputsGroups);
    }
  };

  const removeContext = (index: number, contextIndex: number) => {
    const newInputsGroups = [...inputsGroups];
    if (newInputsGroups[index] && newInputsGroups[index].context) {
      newInputsGroups[index].context.splice(contextIndex, 1);
      setInputsGroup(newInputsGroups);
    }
  };

  const addNewTranslate = () => {
    const newInputsGroups = [...inputsGroups];
    newInputsGroups.push(inputDataGroup);
    setInputsGroup(newInputsGroups);
  };

  const removeTranslate = (index: number) => {
    const newInputsGroups = [...inputsGroups];
    newInputsGroups[index].removed = true;
    setInputsGroup(newInputsGroups);
  };

  const handleLayout = () => {
    if (!startScroll) {
      setScrollBottom(true);
    }
  };

  const updateWord = async (word: TWord) => {
    word.id = wordID;
    await SWords.update(word);
  };

  const validationWord = (): boolean => {
    if (!inputWord) {
      setSaveWordError(true);
      setAlertMessage('Введите слово');
      setAlertVisible(true);
      return true;
    }
    if (!inputsGroups[0].value) {
      setSaveWordError(true);
      setAlertMessage('Введите перевод');
      setAlertVisible(true);
      return true;
    }

    return false;
  };

  const filterInputsGroups = () => {
    const filteredInputsGroups: TTranslate[] = inputsGroups.reduce(
      (acc: TTranslate[], item: TTranslate) => {
        if (item.value == '') {
          return acc;
        }
        if (item.context) {
          item.context = item.context.filter(contextItem => contextItem !== '');
        }
        acc.push(item);
        return acc;
      },
      [],
    );
    setInputsGroup(filteredInputsGroups);
    return filteredInputsGroups;
  };

  const dbSaveWord = async (word: TWord) => {
    return new Promise(async (resolve, reject) => {
      let result = null;
      if (isNewWord) {
        result = await SWords.save(word);
      } else {
        result = await updateWord(word);
      }

      resolve(result);
    });
  };

  const saveWord = async () => {
    if (validationWord()) {
      return;
    }
    const inputsData = filterInputsGroups();

    const word: TWord = {
      word: inputWord,
      translate: inputsData,
    };

    setSaveWordError(false);
    setAlertMessage('Слово сохранено');
    try {
      const result = await dbSaveWord(word);
      if (result === 'duplicate') {
        setAlertMessage('Слово уже есть в словаре');
      }
      setAlertVisible(true);
    } catch (error: any) {
      console.log(error);
      setAlertMessage('При сохранении слова произошла ошибка');
      return setAlertVisible(true);
    }
  };

  const resetForm = () => {
    setInputsGroup([inputDataGroup]);
    setInputWord('');
  };

  const getAlertButtons = (): TAlertButton[] => {
    const buttons: TAlertButton[] = [{
      title: 'Закрыть',
      onPress: () => {
        setAlertVisible(!isAlertVisible);
        setStart(true);
      },
    }];

    if (isSaveWordError) return buttons;

    if (isNewWord) {
      buttons.push({
        title: 'Добавить новое слово',
        onPress: () => {
          setAlertVisible(!isAlertVisible);
          resetForm();
          setStart(true);
          // navigation.navigate('WordEdit', {
          // });
        },
      });
    }
    buttons.push({
      title: 'К списку слов',
      onPress: () => {
        setAlertVisible(!isAlertVisible);
        setStart(true);
        // navigation.navigate(backPathRoute);
      },
    });

    return buttons;
  };

  const inputGroupTemplate = (index: number, data: TTranslate): JSX.Element => {
    return (
      <React.Fragment key={`group-${index}`}>
        <View style={styles.groupInputs}>
          <Input
            style={[styles.mb]}
            key={`translate-${index}`}
            label="Перевод"
            placeholder="Введите перевод"
            value={data.value}
            onChangeText={translate =>
              updateInputGroups(translate, index, 'translate')
            }
            onLayout={() => handleLayout()}
            icon={
              inputsGroups.length > 1
                ? {
                  type: IconsStrings.remove,
                  style: {
                    position: 'absolute',
                    right: '-12%',
                    padding: 10,
                  },
                  onPress: () => removeTranslate(index),
                }
                : undefined
            }
          />

          {data.context &&
            data.context.map((contextValue: string, contextIndex: number) => {
              return (
                <Input
                  style={[styles.mb]}
                  key={`context-${index}-${contextIndex}`}
                  label="Контекст"
                  placeholder="Добавьте контекст"
                  value={contextValue}
                  onChangeText={context =>
                    updateInputGroups(context, index, 'context', contextIndex)
                  }
                  multiline={true}
                  icon={{
                    type: IconsStrings.cancel,
                    style: {
                      position: 'absolute',
                      right: '-12%',
                      padding: 10,
                    },
                    onPress: () => removeContext(index, contextIndex),
                  }}
                />
              )
            })}
          <Button
            title="Добавить контекст"
            onPress={() => addNewContext(index)}
          />
        </View>
      </React.Fragment>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <Header
          backPath={() => {
            setStart(true);
            navigation.goBack();
            // if (!isNewWord) navigation.navigate(backPathRoute);
          }}
          accept={() => saveWord()}
        />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={[styles.scrollViewContent, containerStyles]}>
            <View style={styles.section}>
              <Button
                title="Показать список групп"
                onPress={() => setGroupListVisible(true)}
              />
              <Input
                style={[styles.mb]}
                label="Слово"
                placeholder="Введите слово"
                value={inputWord}
                onChangeText={word => setInputWord(word)}
              />
              {inputsGroups.map((data, index) =>
                data.removed ? null : inputGroupTemplate(index, data),
              )}
            </View>
          </ScrollView>
          <Button
            style={buttonBottomFreeze}
            title="Добавить перевод"
            onPress={() => {
              setStartScroll(false);
              addNewTranslate();
            }}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
      <BottomModalWindow
        isVisible={isGroupListVisible}
        onOverlayPress={() => setGroupListVisible(false)}>
        <SelectDropdown
          data={['Egypt', 'Canada', 'Australia', 'Ireland']}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item;
          }}
          defaultButtonText={'Select country'}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          buttonStyle={styles.dropdown1BtnStyle}
          buttonTextStyle={styles.dropdown1BtnTxtStyle}
          renderDropdownIcon={isOpened => {
            return (
              <Icon
                name={isOpened ? 'chevron-up' : 'chevron-down'}
                color={'#444'}
                size={18}
              />
            );
          }}
          dropdownIconPosition={'right'}
          dropdownStyle={styles.dropdown1DropdownStyle}
          rowStyle={styles.dropdown1RowStyle}
          rowTextStyle={styles.dropdown1RowTxtStyle}
        />
      </BottomModalWindow>
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


