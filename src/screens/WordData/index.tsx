import React from 'react';
import { useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Header } from '../../modules/Header';
import IconsStrings from '../../assets/awesomeIcons';
import { useObject } from '../../store/RealmContext';
import Word from '../../store/models/Word';
import Realm from 'realm';

import containerStyles from '../../styles/container';
import theme from '../../styles/themeLight';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface IWordDataScreenProps {
  navigation: StackNavigationProp<any>;
}

export function WordData({ navigation }: IWordDataScreenProps): JSX.Element {
  const route = useRoute();
  const wordID = (route.params as { wordID?: string })?.wordID;
  const word = useObject(Word, new Realm.BSON.ObjectId(wordID));

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <Header
          backPath={() => navigation.goBack()}
          rightIcon={{
            type: IconsStrings.edit,
            onPress: () => {
              navigation.push('WordEdit', {
                isNewWord: false,
                wordID: wordID,
              });
            },
          }}
        />
        <ScrollView
          contentContainerStyle={[styles.scrollViewContent, containerStyles]}>
          <View style={styles.section}>
            <Text style={{ color: theme.textColor }}>{word?.value ?? ''}</Text>
            {word && word.translates.map((translate, index) => {
              return (
                <React.Fragment key={`group-${index}`}>
                  <View style={styles.groupWord}>
                    <View key={`translate-${index}`}>
                      <Text style={{ color: theme.textColor }}>Перевод:</Text>
                      <Text style={{ color: theme.textColor }}>{translate.value}</Text>
                    </View>

                    {translate.contexts &&
                      translate.contexts.map(
                        (context, contextIndex) => {
                          return (
                            <View key={`context-${index}-${contextIndex}`}>
                              <Text style={{ color: theme.textColor }}>Контекст:</Text>
                              <Text style={{ color: theme.textColor }}>{context.value}</Text>
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
