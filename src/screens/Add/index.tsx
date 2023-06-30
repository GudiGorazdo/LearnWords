import React, { useState, useRef, useEffect, useMemo, MutableRefObject } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Header } from '../../modules/Header';
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
} from 'react-native';

interface IHomeScreenProps {
	navigation: NavigationProp<any>;
}

export function Add({ navigation }: IHomeScreenProps): JSX.Element {
	const inputDataGroup: TTranslate = {
		value: '',
		context: [],
	};


	const [scrollBottom, setScrollBottom] = useState(false);
	const [inputWord, setInputWord] = useState('');
	const [inputsGroups, setInputsGroup] = useState<TTranslate[]>([inputDataGroup]);
	const scrollViewRef = useRef(null);
	useEffect(() => {
		if (scrollBottom) {
			scrollViewRef.current.scrollToEnd({ animated: true });
			setScrollBottom(false);
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
		newInputsGroups.splice(index, 1);
		setInputsGroup(newInputsGroups);
	}

	const handleLayout = () => {
		setScrollBottom(true);
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

	const WordsService = SWords.getInstance();
	const saveWord = async () => {
		const word: TWord = {
			word: inputWord,
			translate: inputsGroups,
		}
		WordsService.saveWord(word);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
		<Header backPath={() => navigation.navigate('Home')} accept={() => saveWord()} />
			<KeyboardAvoidingView
				style={styles.flex}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
			>
				<ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollViewContent}>
					<View style={styles.section}>
						<Input
							label="Слово"
							placeholder="Введите слово"
							value={inputWord}
							onChangeText={(word) => setInputWord(word)}
						/>
						{inputsGroups.map((data, index) => inputGroupTemplate(index, data))}
					</View>
				</ScrollView>
				<Button
					style={styles.addTranslateButton}
					title='Добавить перевод'
					onPress={() => addNewTranslate()}
				/>
			</KeyboardAvoidingView>
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
		...containerStyles
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
	}
});


