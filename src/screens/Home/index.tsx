import React from 'react';
import { Button } from '../../components/Button';

import {
	SafeAreaView,
	StatusBar,
	StyleSheet,
	useColorScheme,
} from 'react-native';

export function Home({ navigation }): JSX.Element {
	const isDarkMode = useColorScheme() === 'dark';
	console.log(isDarkMode);

	return (
		<SafeAreaView style={styles.sectionContainer}>
			<StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
			<Button title='Повторять' onPress={() => navigation.nvigate('Repeat')} />
			<Button title='Добавить' onPress={() => navigation.nvigate('Add')} />
			<Button title='Удалить' onPress={() => navigation.nvigate('Remove')} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	sectionContainer: {
		width: '100%',
		height: '100%',
		marginTop: 32,
		paddingHorizontal: 24,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		rowGap: 20,
	},
});


