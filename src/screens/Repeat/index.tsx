import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import { Header } from '../../modules/Header';

import containerStyles from '../../styles/container';

import {
	SafeAreaView,
	View,
	StyleSheet,
} from 'react-native';

interface IRepeatScreenProps {
	navigation: NavigationProp<any>,
}

export function Repeat ({ navigation }: IRepeatScreenProps): JSX.Element {
	return (
		<SafeAreaView>
			<Header backPath={() => navigation.navigate('Home')} />
			<View style={styles.section}></View>
		</SafeAreaView>
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


