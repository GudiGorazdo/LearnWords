
import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconsStrings from '../../assets/awesomeIcons';
import { TGroup } from '../../storage/words/words.types';
import SWords from '../../storage/words/words.service';

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
	getNewGroupData: (data: TGroup) => void,
}

export function GroupForm({ style, getNewGroupData }: IGroupFormScreenProps): JSX.Element {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');

	useEffect(() => {
		const data: TGroup = {name: name, description: description};
		getNewGroupData(data);
	}, [name, description])

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
					value={description}
					onChangeText={(description) => setDescription(description)}
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


