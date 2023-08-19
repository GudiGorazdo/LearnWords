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
	View,
	ScrollView,
	KeyboardAvoidingView,
	StyleSheet,
	Platform,
} from 'react-native';

interface ITestScreenProps {
	navigation: NavigationProp<any>;
}

export function Test({ navigation }: ITestScreenProps): JSX.Element {
	const route = useRoute();

	const [activeWord, setActiveWord] = useState<TWord | null>(null);

	useEffect(() => { }, []);

	useFocusEffect(() => {
			fetchWord();
	});

	const fetchWord = async () => {
		const word = await SWords.getRandom();
		setActiveWord(word);
	}


	return (
		<SafeAreaView style={styles.safeArea}>
			<Header backPath={() => navigation.navigate('Repeat')} accept={() => console.log('ACCEPT')} />
			<KeyboardAvoidingView
				style={styles.flex}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
			>
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
});


