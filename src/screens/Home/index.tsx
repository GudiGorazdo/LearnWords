import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import { Container } from '../../components/Container';
import { Button } from '../../components/Button';

import {
	SafeAreaView,
	StyleSheet,
} from 'react-native';

interface IHomeScreenProps {
	navigation: NavigationProp<any>,
}

export function Home({ navigation }: IHomeScreenProps): JSX.Element {
	return (
		<Container>
			<SafeAreaView style={styles.sectionContainer}>
				<Button title='Повторять' onPress={() => navigation.navigate('Repeat')} />
				<Button title='Добавить' onPress={() => navigation.navigate('Add')} />
				<Button title='Удалить' onPress={() => navigation.navigate('Remove')} />
			</SafeAreaView>
		</Container>
	);
}

const styles = StyleSheet.create({
	sectionContainer: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		rowGap: 20,
	},
});


