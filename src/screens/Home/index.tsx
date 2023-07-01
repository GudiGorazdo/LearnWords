import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';

import { Button } from '../../components/Button';
import containerStyles from '../../styles/container';
import centeredStyles from '../../styles/centeredContent';
import Counter from '../../store/counter';

import {
	SafeAreaView,
	View,
	Text,
} from 'react-native';

interface IHomeScreenProps {
	navigation: NavigationProp<any>,
}

export const Home = observer(({ navigation }: IHomeScreenProps): JSX.Element => {
	return (
		<SafeAreaView style={{ height: '100%' }}>
			<View style={[containerStyles, centeredStyles]}>
				<Button title='Повторять' onPress={() => navigation.navigate('Repeat')} />
				<Button title='Слова' onPress={() => navigation.navigate('Words')} />
				<View>
					<Button title='+' onPress={() => Counter.increment()} />
					<Button title='-' onPress={() => Counter.decrement()} />
					<Text>{Counter.count}</Text>
				</View>
			</View>
		</SafeAreaView>
	);
})


