import React, { useState, useEffect } from 'react';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Header } from '../../modules/Header';
import { Alert, TAlertButton } from '../../modules/Alert';
import SWords from '../../storage/words/words.service';
import { TTranslate, TWord } from '../../storage/words/words.types';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconsStrings from '../../assets/awesomeIcons';
import { Button } from '../../components/Button';

import buttonBottomFreeze from '../../styles/buttonBottomFreeze';
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
	navigation: StackNavigationProp<any>,
}


export function WordsList({ navigation }: IWordsListScreenProps): JSX.Element {
	const route = useRoute();
	const [groupID, setGroupID] = useState(route.params?.groupID ?? null);

	const startArr: TWord[] = [];
	const [words, setWords] = useState(startArr);

	const [wordToRemove, setWordToRemove] = useState<TWord | null>(null);
	const [isAlertVisible, setAlertVisible] = useState(false);

	useFocusEffect(() => {
		fetchWords();
	});

	const fetchWords = async () => {
		try {
			let words = await SWords.getWordsList(groupID ?? undefined);
			words = words.sort((a, b) => a.word.localeCompare(b.word));
			setWords(words);
		} catch (error) {
			console.log(error);
      throw error;
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
			<Header 
        backPath={() => navigation.goBack()} 
        rightIcon={{
          type: IconsStrings.plus,
          onPress: () => navigation.push(
					'WordEdit',
					{
            groupID: groupID,
						isNewWord: true,
					}
				),
        }}
      />
			<ScrollView contentContainerStyle={[styles.scrollViewContent, containerStyles]}>
				{words.map((word: TWord) => (
					<View key={word.id} style={styles.rowContainer} >
						<TouchableOpacity
							style={styles.wordContainer}
							onPress={() => navigation.push(
								'WordData',
								{
									isShowWord: true,
									wordID: word.id,
                  groupID: groupID,
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
      <Button
        style={buttonBottomFreeze}
        title='Учить'
        onPress={() => navigation.push(
            'WordData',
            {
              isShowWord: true,
              wordID: words[0].id,
              groupID: groupID,
            }
          )}
      />
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


