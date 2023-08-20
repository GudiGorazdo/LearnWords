import React, { useState, useRef, useEffect, useMemo, MutableRefObject } from 'react';
import { NavigationProp, useRoute, useFocusEffect } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Header } from '../../modules/Header';
import { ModalWindow, TModalButton } from '../../modules/ModalWindow';
import SWords from '../../storage/words/words.service';
import { TTranslate, TWord } from '../../storage/words/words.types';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconsStrings from '../../assets/awesomeIcons';

import containerStyles from '../../styles/container';
import buttonBottomFreeze from '../../styles/buttonBottomFreeze';

import {
	SafeAreaView,
	View,
	ScrollView,
	KeyboardAvoidingView,
	StyleSheet,
	Platform,
	Text,
} from 'react-native';

interface IWordDataScreenProps {
	navigation: NavigationProp<any>;
}

export function WordData({ navigation }: IWordDataScreenProps): JSX.Element {
	const route = useRoute();
	const backPathRoute = route.params.backPathRoute;
	const wordNew = route.params.wordNew ?? false;
	const wordID = route.params.wordID ?? null;

	const inputDataGroup: TTranslate = {
		value: '',
		context: [],
		new: true,
	};

	const [wordShow, setWordShow] = useState(route.params.wordShow ?? false)
	const [wordEdit, setWordEdit] = useState(route.params.wordEdit ?? false);

	const [start, setStart] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [modalMessage, setModalMessage] = useState('');
	const [saveWordError, setSaveWordError] = useState(false);
	const [inputWord, setInputWord] = useState('');
	const [inputsGroups, setInputsGroup] = useState<TTranslate[]>([inputDataGroup]);
	const [startScroll, setStartScroll] = useState(true);
	const [scrollBottom, setScrollBottom] = useState(false);
	const scrollViewRef = useRef(null);
	useEffect(() => {
		if (scrollBottom && scrollViewRef && scrollViewRef.current) {
			scrollViewRef.current.scrollToEnd({ animated: true });
			setScrollBottom(false);
		}
	}, [scrollBottom]);

	useFocusEffect(() => {
		if (wordShow && start) {
			fetchWord();
			setStart(false);
		}
	});

	const fetchWord = async () => {
		const word = await SWords.getByID(wordID);
		if (word) {
			setInputWord(word.word);
			setInputsGroup(word.translate);
		}
	}

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
		if (newInputsGroups[index] && newInputsGroups[index].context) {
			newInputsGroups[index].context.push('');
			setInputsGroup(newInputsGroups);
		}
	}

	const removeContext = (index: number, contextIndex: number) => {
		const newInputsGroups = [...inputsGroups];
		if (newInputsGroups[index] && newInputsGroups[index].context) {
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
		if (!startScroll) setScrollBottom(true);
	}


	const updateWord = async (word: TWord) => {
		word.id = wordID;
		await SWords.update(word);
	}

	const validationWord = (): boolean => {
		if (!inputWord) {
			setSaveWordError(true);
			setModalMessage('Введите слово');
			setShowModal(true);
			return true;
		}
		if (!inputsGroups[0].value) {
			setSaveWordError(true);
			setModalMessage('Введите перевод');
			setShowModal(true);
			return true;
		}

		return false;
	}

	const filterInputsGroups = () => {
		const filteredInputsGroups: TTranslate[] = inputsGroups.reduce((acc: TTranslate[], item: TTranslate) => {
			if (item.value == '') return acc;
			if (item.context) {
				item.context = item.context.filter(contextItem => contextItem !== '');
			}
			acc.push(item);
			return acc;
		}, []);
		setInputsGroup(filteredInputsGroups);
		return filteredInputsGroups;
	}

	const dbSaveWord = async (word: TWord) => {
		return new Promise(async (resolve, reject) => {
			let result = null;
			console.log('wordNew: ', wordNew);
			if (wordNew) {
				result = await SWords.save(word);
			} else {
				result = await updateWord(word);
			}

			resolve(result);
		});
	}

	const saveWord = async () => {
		if (validationWord()) return;
		const inputsData = filterInputsGroups();

		const word: TWord = {
			word: inputWord,
			translate: inputsData,
		}

		setSaveWordError(false);
		setModalMessage('Слово сохранено');
		try {
			const result = await dbSaveWord(word);
			if (result === 'dublicate') {
				setModalMessage('Слово уже есть в словаре');
			}
			if (wordNew) setShowModal(true);
			else {
				setWordShow(true)
				setWordEdit(false)
			}
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
				setStart(true);
				if (!saveWordError) {
					if (wordShow) navigation.navigate('WordList');
					else navigation.navigate('Dictionary');
				}
			},
		}];
		if (!saveWordError && !wordShow) {
			buttons.push({
				title: 'Добавить новое слово',
				onPress: () => {
					setShowModal(!showModal);
					resetForm();
					setStart(true);
					navigation.navigate('WordData', { backPathRoute: 'Words', wordShow: false });
				}
			});
			buttons.push({
				title: 'К списку слов',
				onPress: () => {
					setShowModal(!showModal);
					setStart(true);
					navigation.navigate('WordList');
				}
			});
		}
		return buttons;
	}

	const inputGroupTemplate = (index: number, data: TTranslate): JSX.Element => {
		return (
			<React.Fragment key={`group-${index}`} >
				<View style={styles.groupInputs}>
					{wordEdit ? (
						<Input
							key={`translate-${index}`}
							label="Перевод"
							placeholder="Введите перевод"
							value={data.value}
							onChangeText={(translate) => updateInputGroups(translate, index, 'translate')}
							onLayout={() => handleLayout()}
							icon={inputsGroups.length > 1 ? {
								type: IconsStrings.remove,
								style: {
									position: 'absolute',
									right: '-12%',
									padding: 10,
								},
								onPress: () => removeTranslate(index),
							} : undefined}
						/>
					) : (
						<View key={`translate-${index}`}>
							<Text>Перевод:</Text>
							<Text>{data.value}</Text>
						</View>
					)}

					{data.context &&
						data.context.map((contextValue: string, contextIndex: number) => {
							return wordEdit ? (
								<Input
									key={`context-${index}-${contextIndex}`}
									label="Контекст"
									placeholder="Добавьте контекст"
									value={contextValue}
									onChangeText={(context) => updateInputGroups(context, index, 'context', contextIndex)}
									multiline={true}
									icon={{
										type: IconsStrings.cancel,
										style: {
											position: 'absolute',
											right: '-12%',
											padding: 10,
										},
										onPress: () => removeContext(index, contextIndex),
									}}
								/>
							) : (
								<View key={`context-${index}-${contextIndex}`}>
									<Text >Контекст:</Text>
									<Text>{contextValue}</Text>
								</View>
							);
						})
					}
					{wordEdit && <Button title='Добавить контекст' onPress={() => addNewContext(index)} />}
				</View>
			</React.Fragment>
		);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			{wordShow ? (
				<Header
					backPath={() => {
						setStart(true);
						navigation.navigate(backPathRoute);
					}}
					rightIcon={{
						type: IconsStrings.edit,
						onPress: () => {
							setWordEdit(true);
							setWordShow(false);
						},
					}}
				/>
			) : (
				<Header
					backPath={() => {
						setStart(true);
						navigation.navigate(backPathRoute);
					}}
					accept={() => saveWord()}
				/>
			)}
			<KeyboardAvoidingView
				style={styles.flex}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
			>
				<ScrollView ref={scrollViewRef} contentContainerStyle={[styles.scrollViewContent, containerStyles]}>
					<View style={styles.section}>
						{wordEdit ? (
							<Input
								label="Слово"
								placeholder="Введите слово"
								value={inputWord}
								onChangeText={(word) => setInputWord(word)}
							/>
						) : <Text>{inputWord}</Text>
						}
						{inputsGroups.map((data, index) => data.removed ? null : inputGroupTemplate(index, data))}
					</View>
				</ScrollView>
				{wordEdit &&
					<Button
						style={buttonBottomFreeze}
						title='Добавить перевод'
						onPress={() => {
							setStartScroll(false);
							addNewTranslate();
						}}
					/>
				}
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

	wordRow: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
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

	// addTranslateButton: {
	// 	position: 'absolute',
	// 	right: 0,
	// 	bottom: 0,
	// 	width: '100%',
	// 	borderRadius: 0,
	// },
});


