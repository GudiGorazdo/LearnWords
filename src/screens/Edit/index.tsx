import React, { useState, useEffect } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { Header } from '../../modules/Header';
import SWords from '../../storage/words/words.service';
import { TTranslate, TWord } from '../../storage/words/words.types';

import containerStyles from '../../styles/container';

import {
	SafeAreaView,
	View,
	StyleSheet,
	ScrollView,
	Text,
} from 'react-native';

interface IHomeScreenProps {
	navigation: NavigationProp<any>,
}

export function Edit({ navigation }: IHomeScreenProps): JSX.Element {
	const startArr: TWord[] = [];
	const [words, setWords] = useState(startArr);
  useEffect(() => {
    async function fetchData() {
      const WordsService = await SWords.getInstance();
			console.log(WordsService );
      WordsService.getAllWords((fetchedWords: TWord[]) => {
        setWords(fetchedWords);
      });
    }

    fetchData();
  }, []);
	return (
		<SafeAreaView>
			<Header backPath={() => navigation.navigate('Words')} />
			<View style={styles.section}></View>
			<ScrollView>
				{words.map((word: TWord) => (
					<View key={word.id} style={{ padding: 10 }}>
						<Text>{word.word}</Text>
					</View>
				))}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	section: {
		flex: 1,
		justifyContent: 'center',
		rowGap: 20,
		...containerStyles
	},
});


