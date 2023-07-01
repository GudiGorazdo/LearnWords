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
	style?: object,
	backPath?: () => void,
	accept?: () => void,
}

const getStatusBarMargin = (): number => {
	const statusBarHeight = StatusBar.currentHeight ?? 0;
	return Platform.OS === 'android' ? statusBarHeight : 0;
}

export function Header({ style, backPath, accept }: IHeaderScreenProps): JSX.Element {
	return (
		<SafeAreaView>
			<View style={[styles.section, style]}>
				{backPath && <BackButtonArrow style={{paddingLeft: 0}} backPath={() => backPath()} />}
				{accept && <AcceptButton style={{paddingRight: 0}} accept={() => accept()} />}
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


