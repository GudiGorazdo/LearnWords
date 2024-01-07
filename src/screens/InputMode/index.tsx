import React, { useState, useRef, useEffect, useMemo, MutableRefObject } from 'react';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Header } from '../../modules/Header';
import { Alert, TAlertButton } from '../../modules/Alert';
import SWords from '../../storage/words/words.service';
import { TTranslate, TWord } from '../../types';
import IconsStrings from '../../assets/awesomeIcons';
import shuffle from '../../helpers/shuffleArray';

import containerStyles from '../../styles/container';
import buttonBottomFreeze from '../../styles/buttonBottomFreeze';

import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
} from 'react-native';

interface IInputModeScreenProps {
  navigation: StackNavigationProp<any>;
}

type TAnswer = {
  correct: boolean,
  value: string,
}

type TMode = 'word' | 'translate';

export function InputMode({ navigation }: IInputModeScreenProps): JSX.Element {
  const route = useRoute();

  const emptyAnswer: TAnswer = { correct: false, value: '' };

  const modes: TMode[] = ['word', 'translate'];
  const [activeMode, setActiveMode] = useState<TMode>(modes[0]);
  const [isRandomMode, setRandomMode] = useState<boolean>(false);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [activeWord, setActiveWord] = useState<TWord | null>(null);
  const [activeTranslate, setActiveTranslate] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [checkButtonDisabled, setCheckButtonDisabled] = useState(true);
  const [inputsGroups, setInputsGroups] = useState<TAnswer[]>([emptyAnswer]);
  const [scrollBottom, setScrollBottom] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (scrollBottom && scrollViewRef && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
      setScrollBottom(false);
    }
  }, [scrollBottom]);


  useEffect(() => {
    fetchWord();
  }, []);

  useEffect(() => {
    if (isRandomMode) {
      const shuffledModes = shuffle(modes);
      setActiveMode(shuffledModes[0]);
    }
  }, [activeWord])

  useEffect(() => {
  }, [inputsGroups]);

  const fetchWord = async () => {
    const word = await SWords.getRandom();
    if (word) {
      setActiveWord(word);
      const ind = Math.floor(Math.random() * (word.translate.length - 1));
      const shuffledTranslates = shuffle(word.translate);
      const value = shuffledTranslates[ind].value;
      setActiveTranslate(value);
    };
  }

  const updateAnswer = (value: string, index: number) => {
    setInputsGroups(prevInputGroups => {
      const newInputsGroups = [...prevInputGroups];
      newInputsGroups[index].value = value;
      const checkAnswer = newInputsGroups.filter(answer => answer.value > '');
      if (checkAnswer.length > 0) setCheckButtonDisabled(false);
      else setCheckButtonDisabled(true);
      return newInputsGroups;
    });
  }

  const getModalButtons = (): TAlertButton[] => {
    const buttons: TAlertButton[] = [
      {
        title: 'Прервать',
        onPress: () => {
          setAlertVisible(!isAlertVisible);
          navigation.goBack();
        },
      },
      {
        title: 'Продолжить',
        onPress: () => {
          setAlertVisible(!isAlertVisible);
        },
      }
    ];
    return buttons;
  }

  const addNewTranslate = () => {
    setInputsGroups((prevInputGroups: TAnswer[]) => {
      const newInputsGroups = [...prevInputGroups, emptyAnswer];
      return newInputsGroups;
    });
  }

  const handleLayout = () => {
    setScrollBottom(true);
  }

  const reset = () => {
    setInputsGroups([emptyAnswer]);
    setCheckButtonDisabled(true);
    setActiveWord(null);
    setChecked(false);
  }

  const next = () => {
    reset();
    fetchWord();
    // if (isRandomMode) {
    //   const shuffledModes = shuffle(modes);
    //   setActiveMode(shuffledModes[0]);
    // }
  }

  const check = () => {
    setChecked(true);
    setInputsGroups(prevInputGroups => {
      let newInputsGroups = [...prevInputGroups];
      newInputsGroups = newInputsGroups.filter(answer => answer.value > '');
      if (newInputsGroups.length < 1) newInputsGroups = [emptyAnswer];
      newInputsGroups.forEach((answer: TAnswer, index) => {
        if (!activeWord) return;
        let checkAnswer: boolean = false;
        switch (activeMode) {
          case modes[0]:
            checkAnswer = activeWord.word.toLowerCase() === answer.value.toLowerCase();
            break;
          case modes[1]:
            checkAnswer = activeWord.translate.some(translate => {
            	return translate.value.toLowerCase() == answer.value.toLowerCase();
            });
            break;
        }
        if (checkAnswer) newInputsGroups[index].correct = true;
      });
      return newInputsGroups;
    });
  }

  const computedAnswerStyles = (answer: TAnswer) => {
    if (checked) {
      if (answer.correct) return [styles.correctAnswer, styles.textWhite];
      return [styles.inCorrectAnswer, styles.textWhite];
    }
    return [styles.textBlack];
  }

  const changeMode = (mode: TMode) => {
    setRandomMode(false);
    setActiveMode(mode);
    next();
  }

  const changeModeToRandom = () => {
    setRandomMode(true);
    next();
  }

  const getTitle = (): string => {
    switch (activeMode) {
      case 'word':
          return activeTranslate ?? '';
      case 'translate':
          return activeWord?.word ?? '';
    }
  }

  const removeTranslateInput = (index: number): void => {
    let newInputsGroups: TAnswer[] = [... inputsGroups];
    newInputsGroups.splice(index, 1);
    setInputsGroups(newInputsGroups);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header backPath={() => setAlertVisible(true)} />
      <KeyboardAvoidingView
        style={[styles.flex]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView ref={scrollViewRef} contentContainerStyle={[styles.scrollViewContent, containerStyles]}>
          <View style={styles.section}>
            <View style={styles.modes}>
              {modes.map((mode: TMode) => (
                <Button
                  key={`mode_${mode}`}
                  style={styles.modeButton}
                  textStyle={(activeMode === mode) && !isRandomMode ? styles.modeButtonTextActive : styles.modeButtonText}
                  title={mode}
                  onPress={() => changeMode(mode)}
                  disabled={(activeMode === mode) && !isRandomMode}
                />
              ))}
              <Button
                style={styles.modeButton}
                textStyle={isRandomMode ? styles.modeButtonTextActive : styles.modeButtonText}
                title={'random'}
                onPress={() => changeModeToRandom()}
                  disabled={isRandomMode}
              />
            </View>
            <Text style={styles.word}>{getTitle()}</Text>
            {inputsGroups.map((answer: TAnswer, index) => (
              <Input
                key={`translate-${index}`}
                style={computedAnswerStyles(answer)}
                placeholder="Введите перевод"
                value={answer.value}
                onChangeText={(value: string) => updateAnswer(value, index)}
                onLayout={() => handleLayout()}
                disabled={!checked}
                icon={inputsGroups.length > 1 ? {
                  type: IconsStrings.remove,
                  style: {
                    position: 'absolute',
                    right: '-12%',
                    padding: 10,
                  },
                  onPress: () => removeTranslateInput(index),
                } : undefined}
              />
            ))}
            {activeMode === 'translate' && <Button title='Добавить перевод' onPress={() => addNewTranslate()} disabled={checked} />}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Button
        style={buttonBottomFreeze}
        disabled={checkButtonDisabled}
        title={checked ? "Следующее слово" : "Проверить"}
        onPress={() => {
          if (checked) next();
          else check();
        }}
      />
      <Alert
        isVisible={isAlertVisible}
        message="Прервать тренировку?"
        buttons={getModalButtons()}
        onOverlayPress={() => setAlertVisible(!isAlertVisible)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  flex: {
    flex: 1,
  },

  word: {
    width: '100%',
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
  },

  section: {
    width: '80%',
    paddingBottom: 45,
  },

  modes: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  modeButton: {
    backgroundColor: 'transparent',
  },

  modeButtonText: {
    color: 'black',
  },

  modeButtonTextActive: {
    color: 'blue',
  },

  textWhite: {
    color: 'white',
  },

  textBlack: {
    color: 'black',
  },

  correctAnswer: {
    backgroundColor: 'green',
  },

  inCorrectAnswer: {
    backgroundColor: 'red',
  },

  answerText: {
    fontSize: 16,
  },

});


