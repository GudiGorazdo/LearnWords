import React from 'react';
import { StatusBar, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import S_container from '../../styles/container';

import {
	SafeAreaView,
	View,
	StyleSheet,
	TouchableNativeFeedback,
} from 'react-native';

interface IHeaderScreenProps {
	backPath: () => any,
}

const getStatusBarMargin = (): number => {
	return Platform.OS === 'android' ? StatusBar.currentHeight : 0;
}

export function Header({ backPath }: IHeaderScreenProps): JSX.Element {
	return (
		<SafeAreaView>
			<View style={styles.section}>
			<TouchableNativeFeedback styles={{paddingHorizontal: 10}} onPress={() => backPath()}>
				<Icon 
					name="arrow-left" 
					size={24} 
				/>
			</TouchableNativeFeedback>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	section: {
		marginTop: getStatusBarMargin(),
		height: 50,
		displey: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		...S_container
	},
});


