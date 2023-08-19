import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import { CenteredContent } from '../../modules/CenteredContent';
import { Button } from '../../components/Button';

import containerStyles from '../../styles/container';

import {
	StyleSheet,
} from 'react-native';

interface ITrainingScreenProps {
	navigation: NavigationProp<any>,
}

export function Training ({ navigation }: ITrainingScreenProps): JSX.Element {
	return (
		<CenteredContent navigation={navigation} header={true} backPath="Home">
			<Button title='Режим теста' onPress={() => navigation.navigate('TestMode')} />
			<Button title='Режим ввода' onPress={() => navigation.navigate('InputMode')} />
		</CenteredContent>
	);
}

// <Button title='Назад' onPress={() => navigation.navigate('Home')} />
const styles = StyleSheet.create({
	section: {
		flex: 1,
		justifyContent: 'center',
		rowGap: 20,
		...containerStyles
	},
});


