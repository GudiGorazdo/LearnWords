import React, { useState, useRef, useEffect, useMemo, MutableRefObject } from 'react';
import { NavigationProp, useRoute, useFocusEffect } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Header } from '../../modules/Header';
import { Alert, TAlertButton } from '../../modules/Alert';
import SWords from '../../storage/words/words.service';
import { TTranslate, TWord } from '../../storage/words/words.types';
import IconsStrings from '../../assets/awesomeIcons';

import containerStyles from '../../styles/container';
import buttonBottomFreeze from '../../styles/buttonBottomFreeze';

import {
	SafeAreaView,
	Text,
	View,
	ScrollView,
	KeyboardAvoidingView,
	StyleSheet,
	Platform,
} from 'react-native';

interface IInputModeScreenProps {
	navigation: NavigationProp<any>;
}

type TAnswer = {
	correct: boolean,
	value: string,
}

export function InputMode({ navigation }: IInputModeScreenProps): JSX.Element {
	const route = useRoute();

	const emptyAnswer: TAnswer = { correct: false, value: '' };

	const [showModal, setShowModal] = useState(false);
	const [activeWord, setActiveWord] = useState<TWord | null>(null);
	const [checked, setChecked] = useState(false);
	const [checkButtonDisabled, setCheckButtonDisabled] = useState(true);
	const [inputsGroups, setInputsGroups] = useState<TAnswer[]>([emptyAnswer]);
	const [scrollBottom, setScrollBottom] = useState(false);
	const scrollViewRef = useRef(null);

	useEffect(() => {
		if (scrollBottom && scrollViewRef && scrollViewRef.current) {
			scrollViewRef.current.scrollToEnd({ animated: true });
			setScrollBottom(false);
		}
	}, [scrollBottom]);


	useEffect(() => {
		fetchWord();
	}, []);

	useEffect(() => {
		console.log(inputsGroups);
	}, [inputsGroups]);

	const fetchWord = async () => {
		const word = await SWords.getRandom();
		if (word) setActiveWord(word);
	}

	const updateAnswer = (value: string, index: number) => {
		setInputsGroups(prevInputGroups => {
			const newInputsGroups = [...prevInputGroups];
			newInputsGroups[index].value = value;
			const checkAnswer = newInputsGroups.filter(answer => answer.value > '');
			if (checkAnswer.length > 0) setCheckButtonDisabled(false);
			else setCheckButtonDisabled(true);
			return newInputsGroups;
		});
	}

	const getModalButtons = (): TAlertButton[] => {
		const buttons: TAlertButton[] = [
			{
				title: 'Прервать',
				onPress: () => {
					setShowModal(!showModal);
					navigation.navigate('Training');
				},
			},
			{
				title: 'Продолжить',
				onPress: () => {
					setShowModal(!showModal);
				},
			}
		];
		return buttons;
	}

	const addNewTranslate = () => {
		setInputsGroups((prevInputGroups: TAnswer[]) => {
			const newInputsGroups = [...prevInputGroups, emptyAnswer];
			return newInputsGroups;
		});
	}

	const handleLayout = () => {
		setScrollBottom(true);
	}

	const reset = () => {
		setInputsGroups([emptyAnswer]);
		setCheckButtonDisabled(true);
		setActiveWord(null);
		setChecked(false);
	}

	const next = () => {
		reset();
		fetchWord();
	}

	const check = () => {
		setChecked(true);
		setInputsGroups(prevInputGroups => {
			let newInputsGroups = [...prevInputGroups];
			newInputsGroups = newInputsGroups.filter(answer => answer.value > '');
			if (newInputsGroups.length < 1) newInputsGroups = [emptyAnswer];
			newInputsGroups.forEach((answer: TAnswer, index) => {
				if (!activeWord) return;
				const checkAnswer: boolean = activeWord.translate.some(translate => {
					return translate.value.toLowerCase() == answer.value.toLowerCase();
				});
				if (checkAnswer) newInputsGroups[index].correct = true;
			});
			return newInputsGroups;
		});
	}

	const computedAnswerStyles = (answer: TAnswer) => {
		if (checked) {
			if (answer.correct) return [styles.correctAnswer, styles.textWhite];
			return [styles.inCorrectAnswer, styles.textWhite];
		}
		return [styles.textBlack];
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<Header backPath={() => setShowModal(true)} />
			<Text style={styles.word}>{activeWord?.word}</Text>
			<KeyboardAvoidingView
				style={[styles.flex]}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
			>
				<ScrollView ref={scrollViewRef} contentContainerStyle={[styles.scrollViewContent, containerStyles]}>
					<View style={styles.section}>
						{inputsGroups.map((answer: TAnswer, index) => (<Input
							key={`translate-${index}`}
							style={computedAnswerStyles(answer)}
							placeholder="Введите перевод"
							value={answer.value}
							onChangeText={(value: string) => updateAnswer(value, index)}
							onLayout={() => handleLayout()}
							disabled={!checked}
							icon={inputsGroups.length > 1 ? {
								type: IconsStrings.remove,
								style: {
									position: 'absolute',
									right: '-12%',
									padding: 10,
								},
								onPress: () => null,
							} : undefined}
						/>))}
						<Button title='Добавить перевод' onPress={() => addNewTranslate()} disabled={checked} />
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
			<Button
				style={buttonBottomFreeze}
				disabled={checkButtonDisabled}
				title={checked ? "Следующее слово" : "Проверить"}
				onPress={() => {
					if (checked) next();
					else check();
				}}
			/>
			<Alert
				show={showModal}
				message="Прервать тренировку?"
				onClose={() => setShowModal(!showModal)}
				buttons={getModalButtons()}
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
		marginBottom: 20,
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
	},

	scrollViewContent: {
		flexGrow: 1,
		alignItems: 'center',
	},

	section: {
		width: '80%',
		paddingBottom: 45,
	},

	textWhite: {
		color: 'white',
	},

	textBlack: {
		color: 'black',
	},

	correctAnswer: {
		backgroundColor: 'green',
	},

	inCorrectAnswer: {
		backgroundColor: 'red',
	},

	answerText: {
		fontSize: 16,
	},

});


