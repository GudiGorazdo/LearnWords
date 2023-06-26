import React, { useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Header } from '../../modules/Header';

import containerStyles from '../../styles/container';

import {
	SafeAreaView,
	View,
	StyleSheet,
	TextInput,
} from 'react-native';

interface IHomeScreenProps {
	navigation: NavigationProp<any>,
}

export function Add({ navigation }: IHomeScreenProps): JSX.Element {
	const [inputText, setInputText] = useState('');

	return (
		<SafeAreaView>
			<Header backPath={() => navigation.navigate('Home')} />
			<View style={styles.section}>
				<Input
					style={styles.input}
					label="Слово"
					placeholder="Введите слово"
					value={inputText}
					onChangeText={(text) => setInputText(text)}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	section: {
		justifyContent: 'center',
		alignItems: 'center',
		...containerStyles
	},

	input: {
		minWidth: '80%',
		height: 40,
		borderWidth: 1,
		borderColor: 'gray',
		paddingHorizontal: 10,
	},
});


