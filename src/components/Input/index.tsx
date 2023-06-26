import React from 'react';

import {
	View,
	StyleSheet,
	TextInput,
	Text,
} from 'react-native';

interface IInputProps {
	onChangeText: (text: string) => void;
	label?: string;
	value?: string;
	placeholder?: string;
	style?: any;
}

export function Input({
	label,
	value,
	onChangeText,
	placeholder,
	style,
}: IInputProps): JSX.Element {
	return (
		<View style={styles.container}>
			{ label && <Text style={styles.label}>{label}:</Text> }
			<TextInput
				style={style}
				placeholder={placeholder}
				value={value}
				onChangeText={onChangeText}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 16,
	},

	label: {
		fontSize: 16,
		marginBottom: 8,
	},
});


