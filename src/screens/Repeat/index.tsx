import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import { Button } from '../../components/Button';

import S_container from '../../styles/container';

import {
	SafeAreaView,
	View,
	StyleSheet,
} from 'react-native';

interface IHomeScreenProps {
	navigation: NavigationProp<any>,
}

export function Repeat ({ navigation }: IHomeScreenProps): JSX.Element {
	return (
		<SafeAreaView>
			<View style={styles.section}>
				<Button title='Назад' onPress={() => navigation.navigate('Home')} />
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	section: {
		flex: 1,
		justifyContent: 'center',
		rowGap: 20,
		...S_container
	},
});


