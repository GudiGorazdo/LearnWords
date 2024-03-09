import React, { useState } from 'react';
// import {useFocusEffect, useRoute} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Header } from '../../modules/Header';
import { Alert } from '../../modules/Alert';
import { TWordListItem } from '../../types';
import Icon from 'react-native-vector-icons/Ionicons';
import IconsStrings from '../../assets/awesomeIcons';
import { Button } from '../../components/Button';
import { useQuery, useRealm } from '../../store/RealmContext';
import Word from '../../store/models/Word';
import Group from '../../store/models/Group';
import { remove } from '../../store/WordApi';

import buttonBottomFreeze from '../../styles/buttonBottomFreeze';
import containerStyles from '../../styles/container';
import theme from '../../styles/themeLight';

import {
  SafeAreaView,
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';

interface IWordsListScreenProps {
  navigation: StackNavigationProp<any>;
}

export function WordsList({ navigation }: IWordsListScreenProps): JSX.Element {
  const realm = useRealm();
  // const route = useRoute();
  // const [groupID, setGroupID] = useState<number | null>(
  //   route.params?.groupID ?? null,
  // );

  const words = useQuery(Word, words => {
    return words.sorted('value', false);
  });
  // const startArr: TWord[] = [];
  // const [words, setWords] = useState<TWord[]>(startArr);

  const [wordToRemove, setWordToRemove] = useState<Word | null>(null);
  const [isAlertVisible, setAlertVisible] = useState<boolean>(false);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     fetchWords();
  //     return () => {};
  //   }, [groupID]),
  // );

  // const fetchWords = async () => {
  //   try {
  //     // let words = await SWords.getWordsList(groupID ?? null);
  //     words = words.sort((a, b) => a.word.localeCompare(b.word));
  //     setWords(words);
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // };

  const removeWord = async (word: Word) => {
    realm.write(() => remove(realm, word));
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <Header
        backPath={() => navigation.goBack()}
        rightIcon={{
          type: IconsStrings.plus,
          onPress: () =>
            navigation.push('WordEdit', {
              // groupID: groupID,
              isNewWord: true,
            }),
        }}
      />
      <ScrollView
        contentContainerStyle={[styles.scrollViewContent, containerStyles]}>
        {words.map((word: Word) => (
          <View key={word._id.toString()} style={styles.rowContainer}>
            <TouchableOpacity
              style={styles.wordContainer}
              onPress={() =>
                navigation.push('WordData', {
                  isShowWord: true,
                  wordID: word._id.toHexString(),
                })
              }>
              <Text style={{ color: theme.textColor }}>{word.value}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 5 }}
              onPress={() => {
                setWordToRemove(word);
                setAlertVisible(!isAlertVisible);
              }}>
              <Icon
                style={{ color: theme.textColor }}
                name={IconsStrings.remove}
                size={24}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Button
        style={buttonBottomFreeze}
        title="Учить"
        onPress={() =>
          navigation.push('WordData', {
            wordID: words[0]._id.toString(),
            // groupID: groupID,
          })
        }
      />
      <Alert
        isVisible={isAlertVisible}
        message="Удалить слово из словаря?"
        onOverlayPress={() => setAlertVisible(!isAlertVisible)}
        buttons={[
          {
            title: 'Удалить',
            onPress: () => {
              wordToRemove && removeWord(wordToRemove);
              setAlertVisible(!isAlertVisible);
            },
          },
          {
            title: 'Отмена',
            onPress: () => {
              setAlertVisible(!isAlertVisible);
            },
          },
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },

  scrollViewContent: {
    paddingBottom: 50,
    flexGrow: 1,
  },

  rowContainer: {
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  wordContainer: {
    flexGrow: 1,
    paddingVertical: 10,
  },

  removeButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
