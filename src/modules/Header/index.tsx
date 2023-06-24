import React from 'react';
import { StatusBar, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import S_container from '../../styles/container';

import {
	SafeAreaView,
	View,
	StyleSheet,
} from 'react-native';

interface IHeaderScreenProps {
	backPath: () => any,
}

const getStatusBarMargin = (): number|0 => {
	return Platform.OS === 'android' ? StatusBar.currentHeight : 0;
}

export function Header({ backPath }: IHeaderScreenProps): JSX.Element {
	return (
		<SafeAreaView>
			<View style={styles.section}>
				<Icon name="arrow-left" size={24} onPress={() => backPath()} />
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	section: {
		marginTop: getStatusBarMargin(),
		height: 50,
		displey: 'flex',
		justifyContent: 'center',
		...S_container
	},
});


