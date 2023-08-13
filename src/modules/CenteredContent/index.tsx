import React, { useRef, useEffect, useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { Header } from '../../modules/Header';
import containerStyles from '../../styles/container';
import centeredStyles from '../../styles/centeredContent';

import {
	SafeAreaView,
	View,
	StyleSheet,
	UIManager,
	findNodeHandle,
} from 'react-native';

interface IWordsScreenProps {
	navigation: NavigationProp<any>;
	children: React.ReactNode;
	header?: boolean;
}

export const CenteredContent = ({ navigation, children, header }: IWordsScreenProps): JSX.Element => {
	return (
		<View style={styles.content}>
			<View style={styles.header}>
				{header && <Header backPath={() => navigation.navigate('Home')} /> }
			</View>
			<View style={[containerStyles, centeredStyles, { paddingBottom: 0 }]}>
				{children}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	content: {
		height: '100%'
	},

	header: {
		position: 'absolute',
	}
});


