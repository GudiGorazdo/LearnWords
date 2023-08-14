import React, { useState, useRef, useEffect, useMemo, MutableRefObject } from 'react';
import { NavigationProp, useRoute } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Header } from '../../modules/Header';
import { ModalWindow, TModalButton } from '../../modules/ModalWindow';
import SWords from '../../storage/words/words.service';
import { TTranslate, TWord } from '../../storage/words/words.types';

import containerStyles from '../../styles/container';

import {
	SafeAreaView,
	View,
	ScrollView,
	KeyboardAvoidingView,
	StyleSheet,
	Platform,
	Modal,
	Text,
} from 'react-native';

interface IHomeScreenProps {
	navigation: NavigationProp<any>;
}

export function WordData({ navigation }: IHomeScreenProps): JSX.Element {
	const route = useRoute();
	const backPathRoute = route.params.backPathRoute;
	const wordEdit = route.params.wordEdit ?? false;
	const wordID = route.params.wordID ?? null;

	const inputDataGroup: TTranslate = {
		value: '',
		context: [],
		new: true,
	};

	const [start, setStart] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [modalMessage, setModalMessage] = useState('');
	const [saveWordError, setSaveWordError] = useState(false);
	const [scrollBottom, setScrollBottom] = useState(false);
	const [inputWord, setInputWord] = useState('');
	const [inputsGroups, setInputsGroup] = useState<TTranslate[]>([inputDataGroup]);
	const scrollViewRef = useRef(null);
	useEffect(() => {
		if (scrollBottom && scrollViewRef && scrollViewRef.current) {
			scrollViewRef.current.scrollToEnd({ animated: true });
			setScrollBottom(false);
		}

		if (wordEdit && start) {
			SWords.getByID(wordID, (fetchedWord: TWord | null) => {
				if (fetchedWord) {
					setInputWord(fetchedWord.word);
					setInputsGroup(fetchedWord.translate);
				}
			});
		}
	}, [scrollBottom]);

	const updateInputGroups = (value: string, index: number, type: string, contextIndex?: number) => {
		setInputsGroup(prevInputGroups => {
			const newInputsGroups = [...prevInputGroups];
			switch (type) {
				case 'translate':
					newInputsGroups[index].value = value;
					break;
				case 'context':
					if (newInputsGroups[index]['context'] && contextIndex !== undefined) {
						newInputsGroups[index]['context'][contextIndex] = value;
					}
					break;
			}
			return newInputsGroups;
		});
	};

	const addNewContext = (index: number) => {
		const newInputsGroups = [...inputsGroups];
		if (newInputsGroups[index].context) {
			newInputsGroups[index].context.push('');
			setInputsGroup(newInputsGroups);
		}
	}

	const removeContext = (index: number, contextIndex: number) => {
		const newInputsGroups = [...inputsGroups];
		if (newInputsGroups[index].context) {
			newInputsGroups[index].context.splice(contextIndex, 1);
			setInputsGroup(newInputsGroups);
		}
	}

	const addNewTranslate = () => {
		const newInputsGroups = [...inputsGroups];
		newInputsGroups.push(inputDataGroup);
		setInputsGroup(newInputsGroups);
	}

	const removeTranslate = (index: number) => {
		const newInputsGroups = [...inputsGroups];
		newInputsGroups[index].removed = true;
		setInputsGroup(newInputsGroups);
	}

	const handleLayout = () => {
		if (!start) setScrollBottom(true);
	}

	const inputGroupTemplate = (index: number, data: TTranslate): JSX.Element => {
		return (
			<React.Fragment key={`group-${index}`} >
				<View style={styles.groupInputs}>
					<Input
						key={`translate-${index}`}
						label="Перевод"
						placeholder="Введите перевод"
						value={data.value}
						onChangeText={(translate) => updateInputGroups(translate, index, 'translate')}
						onLayout={() => handleLayout()}
						icon={inputsGroups.length > 1 ? {
							type: 'trash',
							style: {
								position: 'absolute',
								right: '-12%',
								padding: 10,
							},
							onPress: () => removeTranslate(index),
						} : undefined}
					/>
					{data.context &&
						data.context.map((contextValue: string, contextIndex: number) => {
							return (
								<Input
									key={`context-${index}-${contextIndex}`}
									label="Контекст"
									placeholder="Добавьте контекст"
									value={contextValue}
									onChangeText={(context) => updateInputGroups(context, index, 'context', contextIndex)}
									multiline={true}
									icon={{
										type: 'remove',
										style: {
											position: 'absolute',
											right: '-12%',
											padding: 10,
										},
										onPress: () => removeContext(index, contextIndex),
									}}
								/>
							);
						})}
					<Button title='Добавить контекст' onPress={() => addNewContext(index)} />
				</View>
			</React.Fragment>
		);
	};

	const updateWord = async (word: TWord) => {
		word.id = wordID;
		await SWords.updateWord(word);
	}

	const saveWord = async () => {
		const word: TWord = {
			word: inputWord,
			translate: inputsGroups,
		}
		if (!word.word) {
			setSaveWordError(true);
			setModalMessage('Введите слово');
			return setShowModal(true);
		}
		if (!word.translate[0].value) {
			setSaveWordError(true);
			setModalMessage('Введите перевод');
			return setShowModal(true);
		}
		setSaveWordError(false);
		setModalMessage('Слово сохранено');
		let result = null;
		try {
			if (wordEdit) {
				await updateWord(word);
			} else {
				result = await SWords.saveWord(word);
			}
			if (result === 'dublicate') {
				setModalMessage('Слово уже есть в словаре');
			}
			return setShowModal(true);
		} catch (error: any) {
			console.log(error);
			setModalMessage('При сохранении слова произошла ошибка');
			return setShowModal(true);
		}
	}

	const resetForm = () => {
		setInputsGroup([inputDataGroup]);
		setInputWord('');
	}

	const getModalButtons = (): TModalButton[] => {
		const buttons: TModalButton[] = [{
			title: 'Закрыть',
			onPress: () => {
				setShowModal(!showModal);
				if (!saveWordError) {
					if (wordEdit) navigation.navigate('Edit');
					else navigation.navigate('Words');
				}
			},
		}];
		if (!saveWordError && !wordEdit) {
			buttons.push({
				title: 'Добавить новое слово',
				onPress: () => {
					setShowModal(!showModal);
					resetForm();
					navigation.navigate('WordData', { backPathRoute: 'Words', wordEdit: false });
				}
			});
			buttons.push({
				title: 'К списку слов',
				onPress: () => {
					setShowModal(!showModal);
					navigation.navigate('Edit');
				}
			});
		}
		return buttons;
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<Header backPath={() => navigation.navigate(backPathRoute)} accept={() => saveWord()} />
			<KeyboardAvoidingView
				style={styles.flex}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
			>
				<ScrollView ref={scrollViewRef} contentContainerStyle={[styles.scrollViewContent, containerStyles]}>
					<View style={styles.section}>
						<Input
							label="Слово"
							placeholder="Введите слово"
							value={inputWord}
							onChangeText={(word) => setInputWord(word)}
						/>
						{inputsGroups.map((data, index) => data.removed ? null : inputGroupTemplate(index, data))}
					</View>
				</ScrollView>
				<Button
					style={styles.addTranslateButton}
					title='Добавить перевод'
					onPress={() => {
						setStart(false);
						addNewTranslate();
					}}
				/>
			</KeyboardAvoidingView>
			<ModalWindow
				show={showModal}
				message={modalMessage}
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
	scrollViewContent: {
		flexGrow: 1,
		alignItems: 'center',
	},

	section: {
		width: '80%',
		paddingBottom: 30,
	},

	groupInputs: {
		marginBottom: 30,
		paddingBottom: 20,
		flexGrow: 1,
		borderBottomWidth: 1,
	},

	contextRow: {
		position: 'relative',
		flexDirection: 'row',
		alignItems: 'center',
	},

	removeContextIcon: {
		position: 'absolute',
		right: 0,
		bottom: 0,
		marginLeft: 10,
	},

	addTranslateButton: {
		position: 'absolute',
		right: 0,
		bottom: 0,
		width: '100%',
		borderRadius: 0,
	},

	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},

	modalOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},

	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
	},

	modalText: {
		marginBottom: 15,
		fontSize: 22,
		textAlign: 'center',
	},

	modalButtonMB: {
		marginBottom: 15,
	},

	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
});


