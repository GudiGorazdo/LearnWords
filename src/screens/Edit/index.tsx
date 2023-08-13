import React, { useState, useEffect } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { Header } from '../../modules/Header';
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
	TouchableOpacity,
} from 'react-native';

interface IHomeScreenProps {
	navigation: NavigationProp<any>,
}

export function Edit({ navigation }: IHomeScreenProps): JSX.Element {
	const startArr: TWord[] = [];
	const [words, setWords] = useState(startArr);

	useEffect(() => {
		SWords.getAllWords((fetchedWords: TWord[]) => {
			setWords(fetchedWords);
		});
	}, []);


	const removeWord = async (word: TWord) => {
		if (word.id) {
			setWords(words.filter(item => item.id !== word.id));
			SWords.removeWordByID(word.id);
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<Header backPath={() => navigation.navigate('Words')} />
			<ScrollView contentContainerStyle={[styles.scrollViewContent, containerStyles]}>
				{words.map((word: TWord) => (
					<View
						key={word.id}
						style={styles.rowContainer}
					>
						<TouchableOpacity
							style={styles.wordContainer}
							onPress={() => navigation.navigate('WordData', { backPathRoute: 'Edit', wordEdit: true, wordID: word.id })}
						>
							<Text>{word.word}</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{ padding: 5 }} onPress={() => removeWord(word)}>
							<Icon name={IconsStrings.remove} size={24} />
						</TouchableOpacity>
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


