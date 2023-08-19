import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
	View,
	StyleSheet,
	TextInput,
	Text,
} from 'react-native';

interface IInputProps {
	ref?: any;
	onLayout?: () => void;
	onChangeText: (text: string) => void;
	label?: string;
	value?: string;
	placeholder?: string;
	style?: any;
	focusedStyle?: any;
	multiline?: boolean;
	numberOfLines?: number;
	disabled?: boolean;
	icon?: {
		front?: boolean,
		type: string,
		style?: object,
		onPress?: () => void,
	},
}

export function Input({
	label,
	value,
	placeholder,
	style,
	focusedStyle,
	multiline,
	numberOfLines,
	icon,
	disabled,
	onChangeText,
	onLayout,
}: IInputProps): JSX.Element {
	const [isFocused, setIsFocused] = useState(false);

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleBlur = () => {
		setIsFocused(false);
	};

	const inputTemplate = () => {
		return (
			<TextInput
				style={[{ paddingTop: 0, paddingBottom: 0, }, style]}
				placeholder={placeholder}
				value={value}
				onChangeText={onChangeText}
				onFocus={handleFocus}
				onBlur={handleBlur}
				multiline={multiline}
				numberOfLines={numberOfLines}
				onLayout={onLayout}
				editable={disabled}
			/>
		);
	}

	const pressIcon = () => {
		if(icon && icon.onPress) {
			icon.onPress();
		}
	}

	const getIcon = () => {
		if (!icon) return;
		return <Icon
			name={icon.type}
			size={16}
			style={[icon.style, { flexShrink: 1 }]}
			onPress={()=>pressIcon()}
		/>
	}

	const getInput = () => {
		return (
			<View style={[styles.inputRow]}>
				{icon && icon.front && getIcon()}
				<View
					style={[
						styles.inputStyle,
						multiline ? styles.textArea : styles.input,
						style,
						isFocused && styles.inputFocused,
						focusedStyle,
						styles.inputContainer,
					]}
				>
					{inputTemplate()}
				</View>
				{icon && !icon.front && getIcon()}
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{label && <Text style={styles.label}>{label}:</Text>}
			{getInput()}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		marginBottom: 16,
	},

	inputContainer: {
		paddingBottom: 8,
		paddingTop: 8,
		justifyContent: 'center',
	},

	label: {
		fontSize: 16,
		marginBottom: 8,
	},

	inputRow: {
		width: '100%',
		flex: 1,
		flexGrow: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},

	inputStyle: {
		borderWidth: 1,
		borderColor: 'gray',
		paddingHorizontal: 10,
		flexGrow: 1,
	},

	input: {
		height: 40,
	},

	textArea: {
		minHeight: 40,
		paddingTop: 5,
	},

	inputFocused: {
		borderColor: 'blue',
	},
});


