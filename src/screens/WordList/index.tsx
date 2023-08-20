import React, { useState, useEffect } from 'react';
import { useFocusEffect, NavigationProp } from '@react-navigation/native';
import { Header } from '../../modules/Header';
import { ModalWindow, TModalButton } from '../../modules/ModalWindow';
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

interface IWordListScreenProps {
	navigation: NavigationProp<any>,
}


export function WordList({ navigation }: IWordListScreenProps): JSX.Element {
	const startArr: TWord[] = [];
	const [wordToRemove, setWordToRemove] = useState<TWord | null>(null);
	const [words, setWords] = useState(startArr);
	const [showModal, setShowModal] = useState(false);

	useFocusEffect(() => {
		fetchWords();
	});

	const fetchWords = async () => {
		try {
			let words = await SWords.getAll();
			words = words.sort((a, b) => a.word.localeCompare(b.word));
			setWords(words);
		} catch(error) {
			console.log(error);
		}
	}


	const removeWord = async (word: TWord) => {
		if (word.id) {
			setWords(words.filter(item => item.id !== word.id));
			SWords.removeByID(word.id);
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<Header backPath={() => navigation.navigate('Dictionary')} />
			<ScrollView contentContainerStyle={[styles.scrollViewContent, containerStyles]}>
				{words.map((word: TWord) => (
					<View key={word.id} style={styles.rowContainer} >
						<TouchableOpacity
							style={styles.wordContainer}
							onPress={() => navigation.navigate('WordData', { backPathRoute: 'WordList', wordShow: true, wordID: word.id })}
						>
							<Text>{word.word}</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{ padding: 5 }} onPress={() => {
							setWordToRemove(word);
							setShowModal(!showModal);
						}}>
							<Icon name={IconsStrings.remove} size={24} />
						</TouchableOpacity>
					</View>
				))}
			</ScrollView>
			<ModalWindow
				show={showModal}
				message='Удалить слово из словаря?'
				onClose={() => setShowModal(!showModal)}
				buttons={[
					{
						title: 'Удалить',
						onPress: () => {
							wordToRemove && removeWord(wordToRemove);
							setShowModal(!showModal);
						}
					},
					{
						title: 'Отмена',
						onPress: () => {
							setShowModal(!showModal);
						}
					}
				]}
			/>
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

