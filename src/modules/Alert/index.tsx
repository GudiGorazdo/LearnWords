import React from 'react';
import { ModalWithOverlay } from '../ModalWithOverlay';
import { Button } from '../../components/Button';

import {
	View,
	Text,
	StyleSheet,
	StyleProp,
	ViewStyle,
} from 'react-native';

export type TAlertButton = {
	style?: StyleProp<ViewStyle>,
	title: string,
	onPress: () => void,
}

interface IAlertProps {
	message: string,
	isVisible: boolean,
	buttons: TAlertButton[],
	style?: StyleProp<ViewStyle>,
	onOverlayPress?: () => void,
}

export function Alert({
	message,
	isVisible,
	buttons,
	style,
	onOverlayPress,
	x,
}: IAlertProps): JSX.Element {
	return (
		<ModalWithOverlay
			style={style ?? {}}
			transparent={true}
			animation="fade"
			isVisible={isVisible}
			onOverlayPress={() => { if (onOverlayPress) onOverlayPress(); }}
		>
			<View style={styles.container}>
				<Text style={[styles.message, styles.marginBottom]}>{message}</Text>
				{buttons.map((button: TAlertButton, index: number) => (
					<Button
						key={index}
						style={[
							(buttons.length - 1 != index) ? styles.marginBottom : {},
							button.style
						]}
						title={button.title}
						onPress={() => button.onPress()}
					/>))}
			</View>
		</ModalWithOverlay>
	);
}

const styles = StyleSheet.create({
	marginBottom: {
		marginBottom: 15,
	},

	container: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
	},

	message: {
		fontSize: 22,
		textAlign: 'center',
	},


	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
});


