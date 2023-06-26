import React from 'react';
import { StatusBar, Platform } from 'react-native';
import BackButtonArrow from '../../components/BackButtonArrow';
import containerStyles from '../../styles/container';

import {
	SafeAreaView,
	View,
	StyleSheet,
} from 'react-native';

interface IHeaderScreenProps {
	backPath?: () => void,
}

const getStatusBarMargin = (): number => {
	const statusBarHeight = StatusBar.currentHeight ?? 0;
	return Platform.OS === 'android' ? statusBarHeight : 0;
}

export function Header({ backPath }: IHeaderScreenProps): JSX.Element {
	return (
		<SafeAreaView>
			<View style={styles.section}>
				{backPath && <BackButtonArrow backPath={() => backPath()} />}
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
		...containerStyles
	},
});


