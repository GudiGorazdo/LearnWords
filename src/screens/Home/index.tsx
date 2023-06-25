import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';

import { Button } from '../../components/Button';
import containerStyles from '../../styles/container';
import Counter from '../../store/counter';

import {
	SafeAreaView,
	View,
	StyleSheet,
	Text,
} from 'react-native';

interface IHomeScreenProps {
	navigation: NavigationProp<any>,
}

export const Home = observer(({ navigation }: IHomeScreenProps): JSX.Element => {
	return (
		<SafeAreaView>
			<View style={styles.section}>
				<Button title='Повторять' onPress={() => navigation.navigate('Repeat')} />
				<Button title='Добавить' onPress={() => navigation.navigate('Add')} />
				<Button title='Удалить' onPress={() => navigation.navigate('Remove')} />
				<View>
					<Button title='+' onPress={() => Counter.increment()} />
					<Button title='-' onPress={() => Counter.decrement()} />
					<Text>{Counter.count}</Text>
				</View>
			</View>
		</SafeAreaView>
	);
})

const styles = StyleSheet.create({
	section: {
		minHeight: '100%',
		flex: 1,
		justifyContent: 'center',
		rowGap: 20,
		...containerStyles
	},
});


