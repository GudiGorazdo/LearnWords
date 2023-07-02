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
	const headerRef = useRef(null);
	const [headerHeight, setHeaderHeight] = useState(50);

	useEffect(() => {
		measureHeader();
	}, []);

	const measureHeader = () => {
		const handle = findNodeHandle(headerRef.current);
		// UIManager.measure(handle, (x, y, width, height) => {
		// 	setHeaderHeight(height);
		// });
	};

	return (
		<View style={styles.content}>
			{header && <Header ref={headerRef} backPath={() => navigation.navigate('Home')} />}
			<View style={[containerStyles, centeredStyles, { paddingBottom: headerHeight }]}>
				{children}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	content: {
		height: '100%'
	},
});


