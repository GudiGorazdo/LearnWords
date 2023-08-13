import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import { Header } from '../../modules/Header';

import containerStyles from '../../styles/container';

import {
	SafeAreaView,
	View,
	StyleSheet,
} from 'react-native';

interface IHomeScreenProps {
	navigation: NavigationProp<any>,
}

export function Remove({ navigation }: IHomeScreenProps): JSX.Element {
	return (
		<SafeAreaView>
			<Header backPath={() => navigation.navigate('Words')} />
			<View style={styles.section}></View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	section: {
		flex: 1,
		justifyContent: 'center',
		rowGap: 20,
		...containerStyles
	},
});


