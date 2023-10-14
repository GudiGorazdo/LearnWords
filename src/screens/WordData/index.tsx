import React, { useState } from 'react';
import { useRoute, useFocusEffect, } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from '../../components/Button';
import { Header } from '../../modules/Header';
import SWords from '../../storage/words/words.service';
import { TTranslate, TWord } from '../../storage/words/words.types';
import IconsStrings from '../../assets/awesomeIcons';

import containerStyles from '../../styles/container';
import buttonBottomFreeze from '../../styles/buttonBottomFreeze';

import {
  SafeAreaView,
  View,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  Text,
} from 'react-native';

interface IWordDataScreenProps {
  navigation: StackNavigationProp<any>;
}

export function WordData({ navigation }: IWordDataScreenProps): JSX.Element {
  const route = useRoute();
  const groupID = route.params.groupID ?? null;

  const wordDataGroup: TTranslate = {
    value: '',
    context: [],
    new: true,
  };

  const [start, setStart] = useState<boolean>(true);
  const [wordID, setWordID] = useState(route.params.wordID ?? null);
  const [wordName, setWordName] = useState<string>('');
  const [wordData, setWordData] = useState<TTranslate[]>([wordDataGroup]);

  useFocusEffect(() => {
    if (start) {
      fetchWord();
      setStart(false);
    }
  });

  const fetchWord = async () => {
    const word = await SWords.getByID(wordID);
    if (word) {
      setWordName(word.word);
      setWordData(word.translate);
    }
  };

  const nextWord = async (order: 'next' | 'prev') => {
    let word = await SWords.getNextWordInGroup(wordID, groupID, order);
    if (!word) {
      const extreme = order === 'next' ? 'first' : 'last';
      word = await SWords.getExtremeWordInGroup(groupID, extreme);
    }
    if (word) {
      setWordID(word.id);
      setWordName(word.word);
      setWordData(word.translate);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <Header
          backPath={() => navigation.goBack() }
          rightIcon={{
            type: IconsStrings.edit,
            onPress: () => navigation.push(
              'WordEdit',
              { isNewWord: false, wordID: wordID, }
            ),
          }}
        />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <Button title="Предыдущее слово" onPress={() => nextWord('prev')} />
          <ScrollView
            contentContainerStyle={[styles.scrollViewContent, containerStyles]}>
            <View style={styles.section}>
              <Text>{wordName}</Text>
              {wordData.map((data, index) => {
                return (
                  <React.Fragment key={`group-${index}`}>
                    <View style={styles.groupWord}>
                      <View key={`translate-${index}`}>
                        <Text>Перевод:</Text>
                        <Text>{data.value}</Text>
                      </View>

                      {data.context &&
                        data.context.map((contextValue: string, contextIndex: number) => {
                          return (
                            <View key={`context-${index}-${contextIndex}`}>
                              <Text>Контекст:</Text>
                              <Text>{contextValue}</Text>
                            </View>
                          );
                        })}
                    </View>
                  </React.Fragment>
                );
              })}
            </View>
          </ScrollView>
          <Button
            style={buttonBottomFreeze}
            title="Следующее слово"
            onPress={() => nextWord('next')}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
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

  section: {
    width: '80%',
    paddingBottom: 30,
  },

  groupWord: {
    marginBottom: 30,
    paddingBottom: 20,
    flexGrow: 1,
    borderBottomWidth: 1,
  },
});


