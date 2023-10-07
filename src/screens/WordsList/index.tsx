import React, { useState, useEffect } from 'react';
import { useFocusEffect, NavigationProp, useRoute } from '@react-navigation/native';
import { Header } from '../../modules/Header';
import { Alert, TAlertButton } from '../../modules/Alert';
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

interface IWordsListScreenProps {
	navigation: NavigationProp<any>,
}


export function WordsList({ navigation }: IWordsListScreenProps): JSX.Element {
	const route = useRoute();
	const backPathRoute = route.params?.backPathRoute || 'Home';
	const [groupID, setGroupID] = useState(route.params?.groupID ?? null);

	const startArr: TWord[] = [];
	const [words, setWords] = useState(startArr);

	const [wordToRemove, setWordToRemove] = useState<TWord | null>(null);
	const [isAlertVisible, setAlertVisible] = useState(false);

	useEffect(() => {
		fetchWords();
	}, []);

	const fetchWords = async () => {
		try {
			let words = await SWords.getWordsList(groupID ?? undefined);
			words = words.sort((a, b) => a.word.localeCompare(b.word));
			setWords(words);
		} catch (error) {
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
			<Header backPath={() => navigation.navigate(backPathRoute)} />
			<ScrollView contentContainerStyle={[styles.scrollViewContent, containerStyles]}>
				{words.map((word: TWord) => (
					<View key={word.id} style={styles.rowContainer} >
						<TouchableOpacity
							style={styles.wordContainer}
							onPress={() => navigation.navigate(
								'WordData',
								{
									backPathRoute: 'WordsList',
									isShowWord: true,
									wordID: word.id
								}
							)}
						>
							<Text>{word.word}</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{ padding: 5 }} onPress={() => {
							setWordToRemove(word);
							setAlertVisible(!isAlertVisible);
						}}>
							<Icon name={IconsStrings.remove} size={24} />
						</TouchableOpacity>
					</View>
				))}
			</ScrollView>
			<Alert
				isVisible={isAlertVisible}
				message='Удалить слово из словаря?'
				onOverlayPress={() => setAlertVisible(!isAlertVisible)}
				buttons={[
					{
						title: 'Удалить',
						onPress: () => {
							wordToRemove && removeWord(wordToRemove);
							setAlertVisible(!isAlertVisible);
						}
					},
					{
						title: 'Отмена',
						onPress: () => {
							setAlertVisible(!isAlertVisible);
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


