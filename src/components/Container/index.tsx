import React from 'react';
import type {PropsWithChildren} from 'react';
import {
	SafeAreaView,
	StyleSheet,
} from 'react-native';

export function Container ({ children }: PropsWithChildren): JSX.Element {
	return (
		<SafeAreaView style={styles.sectionContainer}>
			{children}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	sectionContainer: {
		minWidth: '100%',
		minHeight: '100%',
		marginTop: 32,
		paddingHorizontal: 24,
	},
});


