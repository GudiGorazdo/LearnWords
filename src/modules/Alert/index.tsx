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

interface IModalWindowProps {
	message: string,
	show: boolean,
	buttons: TAlertButton[],
	onClose: () => void,
}

export function Alert({
	message,
	show,
	buttons,
	onClose,
}: IModalWindowProps): JSX.Element {
	return (
		<ModalWithOverlay
			animation="fade"
			show={show}
			onClose={() => onClose()}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<Text style={styles.modalText}>{message}</Text>
					{buttons.map((button: TAlertButton, index: number) => (
						<Button
							key={index}
							style={[
								(buttons.length - 1 != index) ? styles.modalButtonMB : {},
								button.style
							]}
							title={button.title}
							onPress={() => button.onPress()}
						/>))}
				</View>
			</View>
		</ModalWithOverlay>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},

	modalOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},

	modalView: {
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

	modalText: {
		marginBottom: 15,
		fontSize: 22,
		textAlign: 'center',
	},

	modalButtonMB: {
		marginBottom: 15,
	},

	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
});


