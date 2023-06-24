import React from 'react';
import type { PropsWithChildren } from 'react';
import { Text, StyleSheet, TouchableNativeFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export type IButtonProps = PropsWithChildren<{
	title: string,
	onPress: () => void,
	icon?: {
		front?: boolean,
		type: string,
		styles?: object, 
	},
}>;

export function Button({ title, onPress, icon = undefined }: IButtonProps) {
	const handlePress = () => {
		onPress();
	};

	const getIcon = () => {
		if (!icon) return;
		return <Icon name={icon.type} size={16} style={icon.styles ?? {}} />
	}

	return (
		<TouchableNativeFeedback onPress={handlePress}>
			<View style={styles.button}>
				{icon && icon.front && getIcon()}
				<Text style={styles.buttonText}>{title}</Text>
				{icon && !icon.front && getIcon()}
			</View>
		</TouchableNativeFeedback>
	);
}

const styles = StyleSheet.create({
	button: {
		width: '100%',
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


