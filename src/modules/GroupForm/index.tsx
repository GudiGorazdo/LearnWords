
import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconsStrings from '../../assets/awesomeIcons';
import { TGroup } from '../../storage/words/words.types';

import containerStyles from '../../styles/container';

import {
	SafeAreaView,
	View,
	StyleSheet,
	StyleProp,
	ViewStyle,
} from 'react-native';

interface IGroupFormScreenProps {
	style?: StyleProp<ViewStyle>,
}

export function GroupForm({ style, }: IGroupFormScreenProps): JSX.Element {
	const [name, setName] = useState('');

	return (
		<SafeAreaView >
			<View style={[containerStyles, styles.body, style]}>
				<Input
					style={styles.input}
					label="Название"
					placeholder="Введите название"
					value={name}
					onChangeText={(name) => setName(name)}
				/>
				<Input
					style={styles.input}
					label="Описание"
					placeholder="Введите описание"
					value={name}
					onChangeText={(name) => setName(name)}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	body: {
		paddingVertical: 30,
	},

	input: {
		marginBottom: 10,
	}
});


