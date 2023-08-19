import React from 'react';
import type { PropsWithChildren } from 'react';
import { Text, StyleSheet, TouchableNativeFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export type IButtonProps = PropsWithChildren<{
	title: string,
	onPress: () => void,
	style?: object,
	textStyle?: object,
	disabled?: boolean,
	icon?: {
		front?: boolean,
		type: string,
		style?: object,
	},
}>;

export const Button = ({
	title,
	onPress,
	style,
	textStyle,
	icon,
	disabled
}: IButtonProps) => {
	const handlePress = () => {
		if (!disabled) {
			onPress();
		}
	};

	const getIcon = () => {
		if (!icon) return null;
		return <Icon name={icon.type} size={16} style={icon.style ?? {}} />;
	};

	const buttonStyles = [
		styles.button,
		style,
		disabled && styles.disabledButton
	];

	return (
		<TouchableNativeFeedback onPress={handlePress} disabled={disabled}>
			<View style={buttonStyles}>
				{icon && icon.front && getIcon()}
				<Text style={[styles.buttonText, textStyle]}>{title}</Text>
				{icon && !icon.front && getIcon()}
			</View>
		</TouchableNativeFeedback>
	);
};

const styles = StyleSheet.create({
	button: {
		borderRadius: 8,
		padding: 10,
		overflow: 'hidden',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'blue',
	},
	disabledButton: {
		backgroundColor: 'gray',
		opacity: 0.7,
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
	},
});


