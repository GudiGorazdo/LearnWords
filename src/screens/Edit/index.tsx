import React, { useState, useEffect } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { Header } from '../../modules/Header';
import { Button } from '../../components/Button';
import SWords from '../../storage/words/words.service';
import { TTranslate, TWord } from '../../storage/words/words.types';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconsStrings from '../../assets/awesomeIcons';

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
			WordsService.getAllWords((fetchedWords: TWord[]) => {
				setWords(fetchedWords);
			});
		}

		fetchData();
	}, []);

	const removeWord = (word: TWord) => {
		setWords(words.filter(item => item.id !== word.id));
	}

	return (
		<SafeAreaView style={styles.container}>
			<Header backPath={() => navigation.navigate('Words')} />
			<ScrollView contentContainerStyle={[styles.scrollViewContent, containerStyles]}>
				{words.map((word: TWord) => (
					<View 
						key={word.id} 
						style={styles.wordContainer}
					>
						<Text style={{flexGrow: 1}} onPress={() => console.log('edit')}>{word.word}</Text>
						<Icon
							style={{padding: 5}}
							name={IconsStrings.remove}
							size={24}
							onPress={() => removeWord(word)}
						/>
					</View>
				))}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	scrollViewContent: {
		flexGrow: 1,
	},

	wordContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 10,
	},

	removeButton: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'transparent',
	},
});


