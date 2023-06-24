import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import { Header } from '../../modules/Header';

import S_container from '../../styles/container';

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
			<Header backPath={() => navigation.navigate('Home')} />
			<View style={styles.section}></View>
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


