import React from 'react';
import { NavigationProp } from '@react-navigation/native';
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
		paddingTop: 20,
		...S_container
	},
});


