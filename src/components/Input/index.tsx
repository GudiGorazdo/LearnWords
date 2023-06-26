import React, { useState } from 'react';

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
	focusedStyle?: any;
}

export function Input({
	label,
	value,
	onChangeText,
	placeholder,
	style,
	focusedStyle,
}: IInputProps): JSX.Element {
	const [isFocused, setIsFocused] = useState(false);

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleBlur = () => {
		setIsFocused(false);
	};

	return (
		<View style={styles.container}>
			{label && <Text style={styles.label}>{label}:</Text>}
			<TextInput
				style={[style, isFocused && focusedStyle]}
				placeholder={placeholder}
				value={value}
				onChangeText={onChangeText}
				onFocus={handleFocus}
				onBlur={handleBlur}
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


