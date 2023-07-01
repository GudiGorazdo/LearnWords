import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import { Header } from '../../modules/Header';
import { Button } from '../../components/Button';
import containerStyles from '../../styles/container';
import centeredStyles from '../../styles/centeredContent';

import {
	SafeAreaView,
	View,
	StyleSheet,
	Dimensions,
} from 'react-native';

interface IWordsScreenProps {
	navigation: NavigationProp<any>,
}

export const Words = ({ navigation }: IWordsScreenProps): JSX.Element => {
	const screenHeight = Dimensions.get('screen').height;
	const contentHeight = screenHeight - 108;

	return (
		<SafeAreaView>
			<Header backPath={() => navigation.navigate('Home')} />
			<View style={{height: contentHeight}}>
				<View style={[containerStyles, centeredStyles]}>
					<Button title='Добавить' onPress={() => navigation.navigate('Add')} />
					<Button title='Удалить' onPress={() => navigation.navigate('Remove')} />
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({});


