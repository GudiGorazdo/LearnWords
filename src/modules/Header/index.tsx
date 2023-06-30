import React from 'react';
import { StatusBar, Platform } from 'react-native';
import BackButtonArrow from '../../components/BackButtonArrow';
import AcceptButton from '../../components/AcceptButton';
import containerStyles from '../../styles/container';

import {
	SafeAreaView,
	View,
	StyleSheet,
} from 'react-native';

interface IHeaderScreenProps {
	backPath?: () => void,
	accept?: () => void,
}

const getStatusBarMargin = (): number => {
	const statusBarHeight = StatusBar.currentHeight ?? 0;
	return Platform.OS === 'android' ? statusBarHeight : 0;
}

export function Header({ backPath, accept }: IHeaderScreenProps): JSX.Element {
	return (
		<SafeAreaView>
			<View style={styles.section}>
				{backPath && <BackButtonArrow backPath={() => backPath()} />}
				{accept && <AcceptButton accept={() => accept()} />}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	section: {
		marginTop: getStatusBarMargin(),
		height: 50,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		...containerStyles
	},
});


