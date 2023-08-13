import React, { RefObject } from 'react';
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
	style?: object;
	onLayout?: () => void;
	backPath?: () => void;
	accept?: () => void;
}

const getStatusBarMargin = (): number => {
	const statusBarHeight = StatusBar.currentHeight ?? 0;
	return Platform.OS === 'android' ? statusBarHeight : 0;
};

export const Header = ({
	style,
	backPath,
	accept,
	onLayout,
}: IHeaderScreenProps): JSX.Element => {
	return (
		<SafeAreaView onLayout={() => onLayout ? onLayout() : null}>
			<View style={[styles.header, style]}>
				{backPath && <BackButtonArrow style={{ paddingLeft: 0 }} backPath={() => backPath()} />}
				{accept && <AcceptButton style={{ paddingRight: 0 }} accept={() => accept()} />}
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	header: {
		marginTop: getStatusBarMargin(),
		height: 50,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		...containerStyles,
	},
});


