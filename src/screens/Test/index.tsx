import React, { useState, useRef, useEffect, useMemo, MutableRefObject } from 'react';
import { NavigationProp, useRoute, useFocusEffect } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Header } from '../../modules/Header';
import { ModalWindow, TModalButton } from '../../modules/ModalWindow';
import SWords from '../../storage/words/words.service';
import { TTranslate, TWord } from '../../storage/words/words.types';
import IconsStrings from '../../assets/awesomeIcons';

import containerStyles from '../../styles/container';

import {
	SafeAreaView,
	Text,
	View,
	ScrollView,
	KeyboardAvoidingView,
	StyleSheet,
	Platform,
	TouchableOpacity,
} from 'react-native';

interface ITestScreenProps {
	navigation: NavigationProp<any>;
}

type TAnswer = TTranslate & {
	correct: boolean,
	selected: boolean,
}

export function Test({ navigation }: ITestScreenProps): JSX.Element {
	const route = useRoute();

	const [activeWord, setActiveWord] = useState<TWord | null>(null);
	const [correctAnswers, setCorrectAnswers] = useState<TAnswer[]>([]);
	const [inCorrectAnswers, setInCorrectAnswers] = useState<TAnswer[]>([]);
	const [activeAnswers, setActiveAnswers] = useState<TAnswer[]>([]);

	useEffect(() => {
		fetchWord();
	}, []);

	useEffect(() => {
		if (activeWord) {
			getCorrectAnswer();
			fetchRandomAnswers();
		}
	}, [activeWord]);

	useEffect(() => {
		if (correctAnswers && inCorrectAnswers) getAnswers();
	}, [correctAnswers, inCorrectAnswers]);

	useEffect(() => {
		if (activeAnswers) console.log('answers\n', activeAnswers);
	}, [activeAnswers]);

	const getAnswers = () => {
		const answers: TAnswer[] = [
			...correctAnswers,
			...inCorrectAnswers.slice(0, 6 - correctAnswers.length)
		];
		setActiveAnswers(answers.slice().sort(() => 0.5 - Math.random()));
	}

	const fetchWord = async () => {
		const word = await SWords.getRandom();
		if (word) setActiveWord(word);
	}

	const getCorrectAnswer = async () => {
		if (!activeWord) return;
		const answersArr = getRandomFromArr(activeWord.translate);
		const answers: TAnswer[] = setCorrect(answersArr, true);
		setCorrectAnswers(answers);
	}

	const fetchRandomAnswers = async () => {
		if (activeWord && activeWord.id) {
			let answersArr = await SWords.getRandomAnswers(activeWord.id);
			const answers: TAnswer[] = setCorrect(answersArr, false);
			setInCorrectAnswers(answers);
		}
	}

	const setCorrect = (arr: TTranslate[], value: boolean): TAnswer[] => {
		return arr.reduce((acc: TAnswer[], answer: TTranslate) => {
			acc.push({ ...answer, correct: value, selected: false });
			return acc;
		}, []);
	}

	function getRandomFromArr<T>(array: T[]): T[] {
		const count = Math.floor(Math.random() * array.length) + 1;
		const shuffledArray = array.slice().sort(() => 0.5 - Math.random());
		return shuffledArray.slice(0, Math.min(count, shuffledArray.length));
	}

	const handleAnswerClick = (index: number) => {
		setActiveAnswers(prevAnswers => {
			const updatedAnswers = [...prevAnswers];
			updatedAnswers[index].selected = !updatedAnswers[index].selected;
			return updatedAnswers;
		});
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<Header backPath={() => navigation.navigate('Repeat')} accept={() => console.log('ACCEPT')} />
			<Text style={styles.word}>{activeWord?.word}</Text>
			<ScrollView>
				{activeAnswers.map((answer, index) => (
					<TouchableOpacity
						key={index}
						onPress={() => handleAnswerClick(index)}
						style={[
							styles.answerContainer,
							answer.selected ? styles.selectedAnswer : styles.unselectedAnswer
						]}
					>
						<Text 
							style={[
							styles.answerText,
							answer.selected ? styles.selectedAnswerText : null
							]}>{answer.value}</Text>
					</TouchableOpacity>
				))}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},

	flex: {
		flex: 1,
	},

	word: {
		width: '100%',
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
	},

	answerContainer: {
		padding: 10,
		marginVertical: 5,
		borderRadius: 8,
	},

	selectedAnswer: {
		backgroundColor: 'blue', 
		color: 'white',
	},

	unselectedAnswer: {
		// backgroundColor: 'gray', 
	},

	answerText: {
		fontSize: 16,
	},

	selectedAnswerText: {
		color: 'white',
	},
});


