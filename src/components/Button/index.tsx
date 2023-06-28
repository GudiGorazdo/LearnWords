import React from 'react';
import type { PropsWithChildren } from 'react';
import { Text, StyleSheet, TouchableNativeFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export type IButtonProps = PropsWithChildren<{
	title: string,
	onPress: () => void,
	style?: object,
	textStyle?: object,
	icon?: {
		front?: boolean,
		type: string,
		style?: object,
	},
}>;

export function Button({ title, onPress, style, textStyle, icon }: IButtonProps) {
	const handlePress = () => {
		onPress();
	};

	const getIcon = () => {
		if (!icon) return;
		return <Icon name={icon.type} size={16} style={icon.style ?? {}} />
	}

	return (
		<TouchableNativeFeedback onPress={handlePress}>
			<View style={[styles.button, style]}>
				{icon && icon.front && getIcon()}
				<Text style={[styles.buttonText, textStyle]}>{title}</Text>
				{icon && !icon.front && getIcon()}
			</View>
		</TouchableNativeFeedback>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: 'blue',
		borderRadius: 8,
		padding: 10,
		overflow: 'hidden',
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
	},
});


