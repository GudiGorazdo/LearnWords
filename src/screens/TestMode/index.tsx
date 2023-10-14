import React, { useState, useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from '../../components/Button';
import { Header } from '../../modules/Header';
import { Alert, TAlertButton } from '../../modules/Alert';
import SWords from '../../storage/words/words.service';
import { TTranslate, TWord } from '../../storage/words/words.types';
import shuffle from '../../helpers/shuffleArray';

import containerStyles from '../../styles/container';
import buttonBottomFreeze from '../../styles/buttonBottomFreeze';

import {
	SafeAreaView,
	Text,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';

interface ITestModeScreenProps {
	navigation: StackNavigationProp<any>;
}

type TAnswer = TTranslate & {
	correct: boolean,
	selected: boolean,
}

export function TestMode({ navigation }: ITestModeScreenProps): JSX.Element {
	const [isAlertVisible, setAlertVisible] = useState(false);
	const [activeWord, setActiveWord] = useState<TWord | null>(null);
	const [correctAnswers, setCorrectAnswers] = useState<TAnswer[]>([]);
	const [inCorrectAnswers, setInCorrectAnswers] = useState<TAnswer[]>([]);
	const [activeAnswers, setActiveAnswers] = useState<TAnswer[]>([]);
	const [isAnyAnswerSelected, setIsAnyAnswerSelected] = useState(false);
	const [checked, setChecked] = useState(false);


	useEffect(() => {
		fetchWord();
	}, []);

	useEffect(() => {
		if (activeWord) {
			console.log(activeWord);
			console.log((activeWord.translate[0].context));
			getCorrectAnswer();
			fetchRandomAnswers();
		}
	}, [activeWord]);

	useEffect(() => {
		if (correctAnswers && inCorrectAnswers) getAnswers();
	}, [correctAnswers, inCorrectAnswers]);

	useEffect(() => {
		// if (activeAnswers) console.log('answers\n', activeAnswers);
	}, [activeAnswers]);

	const getAnswers = () => {
		const answers: TAnswer[] = [
			...correctAnswers,
			...inCorrectAnswers.slice(0, 6 - correctAnswers.length)
		];
		setActiveAnswers(shuffle(answers));
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
		const shuffledArray = shuffle(array);
    const toSlice = Math.min(count, shuffledArray.length);
		return shuffledArray.slice(0, toSlice);
	}

	const handleAnswerClick = (index: number) => {
		if (checked) return;
		setActiveAnswers(prevAnswers => {
			const updatedAnswers = [...prevAnswers];
			updatedAnswers[index].selected = !updatedAnswers[index].selected;
			const selected = activeAnswers.some(answer => answer.selected);
			if (selected) setIsAnyAnswerSelected(true);
			else setIsAnyAnswerSelected(false);
			return updatedAnswers;
		});
	}

	const getModalButtons = (): TAlertButton[] => {
		const buttons: TAlertButton[] = [
			{
				title: 'Прервать',
				onPress: () => {
					setAlertVisible(!isAlertVisible);
					navigation.goBack();
				},
			},
			{
				title: 'Продолжить',
				onPress: () => {
					setAlertVisible(!isAlertVisible);
				},
			}
		];
		return buttons;
	}

	const computedAnswerStyles = (answer: TAnswer) => {
		if (checked) {
			if (answer.correct) return styles.correctAnswer;
			if (answer.selected && !answer.correct) return styles.inCorrectAnswer;
		} else {
			return answer.selected ? styles.selectedAnswer : styles.unselectedAnswer;
		}
	}

	const reset = () => {
		setActiveWord(null);
		setCorrectAnswers([]);
		setInCorrectAnswers([]);
		setActiveAnswers([]);
		setIsAnyAnswerSelected(false);
		setChecked(false);
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<Header backPath={() => setAlertVisible(true)} />
			<Text style={styles.word}>{activeWord?.word}</Text>
			<ScrollView style={containerStyles}>
				{activeAnswers.map((answer, index) => (
					<TouchableOpacity
						key={index}
						disabled={checked}
						onPress={() => handleAnswerClick(index)}
						style={[
							styles.answerContainer,
							computedAnswerStyles(answer),
						]}
					>
						<Text
							style={[
								styles.answerText,
								answer.selected ? styles.selectedAnswerText : null,
								answer.correct && checked ? styles.selectedAnswerText : null
							]}>{answer.value}</Text>
					</TouchableOpacity>
				))}
			</ScrollView>
			<Button
				style={buttonBottomFreeze}
				disabled={!isAnyAnswerSelected}
				title={checked ? "Следующее слово" : "Проверить"}
				onPress={() => {
					if (checked) {
						reset();
						fetchWord();
					} else setChecked(true);
				}}
			/>
			<Alert
				isVisible={isAlertVisible}
				message="Прервать тренировку?"
				buttons={getModalButtons()}
				onOverlayPress={() => setAlertVisible(!isAlertVisible)}
			/>
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

	correctAnswer: {
		backgroundColor: 'green',
	},

	inCorrectAnswer: {
		backgroundColor: 'red',
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


