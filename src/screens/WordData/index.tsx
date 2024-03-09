import React, { useState } from "react";
import { useFocusEffect, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Button } from "../../components/Button";
import { Header } from "../../modules/Header";
import SWords from "../../storage/words/words.service";
import { TTranslate, TWord } from "../../storage/words/words.types";
import IconsStrings from "../../assets/awesomeIcons";

import containerStyles from "../../styles/container";
import buttonBottomFreeze from "../../styles/buttonBottomFreeze";

import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type RootStackParamList = {
  WordData: {
    groupID?: number,
    wordID?: number,
  };

  WordEdit: {
    isNewWord: boolean;
    wordID: number | null;
    groupID: number | null;
  };

};

interface IWordDataScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'WordData'>;
}

export function WordData({ navigation }: IWordDataScreenProps): JSX.Element {
  const route = useRoute<RouteProp<RootStackParamList, 'WordData'>>();
  const groupID: number | null = route.params?.groupID ?? null;

  const wordDataGroup: TTranslate = {
    value: "",
    context: [],
    new: true,
  };

  const [start, setStart] = useState<boolean>(true);
  const [wordID, setWordID] = useState<number | null>(
    route.params?.wordID ?? null,
  );
  const [wordName, setWordName] = useState<string>("");
  const [wordData, setWordData] = useState<TTranslate[]>([wordDataGroup]);

  useFocusEffect(() => {
    if (start) {
      fetchWord();
      setStart(false);
    }
  });

  const fetchWord = async () => {
    if (!wordID) return;
    const word = await SWords.getByID(wordID);
    if (word) {
      setWordName(word.word);
      setWordData(word.translate);
    }
  };

  const nextWord = async (order: "next" | "prev") => {
    if (!wordID || !groupID) return;
    let word = await SWords.getNextWordInGroup(wordID, groupID, order);
    if (!word) {
      const extreme = order === "next" ? "first" : "last";
      word = await SWords.getExtremeWordInGroup(groupID, extreme);
    }
    if (word) {
      setWordID(word.id ?? null);
      setWordName(word.word);
      setWordData(word.translate);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <Header
          backPath={() => navigation.goBack()}
          rightIcon={{
            type: IconsStrings.edit,
            onPress: () => {
              setStart(true);
              navigation.push(
                "WordEdit",
                { isNewWord: false, wordID: wordID, groupID: groupID },
              );
            },
          }}
        />
        <Button title="Предыдущее слово" onPress={() => nextWord("prev")} />
        <ScrollView
          contentContainerStyle={[styles.scrollViewContent, containerStyles]}
        >
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
                      data.context.map(
                        (contextValue: string, contextIndex: number) => {
                          return (
                            <View key={`context-${index}-${contextIndex}`}>
                              <Text>Контекст:</Text>
                              <Text>{contextValue}</Text>
                            </View>
                          );
                        },
                      )}
                  </View>
                </React.Fragment>
              );
            })}
          </View>
        </ScrollView>
        <Button
          style={buttonBottomFreeze}
          title="Следующее слово"
          onPress={() => nextWord("next")}
        />
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
    alignItems: "center",
  },

  section: {
    width: "80%",
    paddingBottom: 30,
  },

  groupWord: {
    marginBottom: 30,
    paddingBottom: 20,
    flexGrow: 1,
    borderBottomWidth: 1,
  },
});
