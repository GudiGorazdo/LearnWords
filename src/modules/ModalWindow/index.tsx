import React from 'react';
import { Button } from '../../components/Button';

import {
	View,
	StyleSheet,
	Modal,
	Text,
} from 'react-native';

export type TModalButton = {
	style: object,
	title: string,
	onPress: () => void,
}

interface IModaWindowProps {
	modalMessage: string,
	showModal: boolean,
	buttons: TModalButton[],
	onRequestClose: () => void,
}

export function ModaWindow({
	modalMessage,
	showModal,
	buttons,
	onRequestClose,
}: IModaWindowProps): JSX.Element {
	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={showModal}
			onRequestClose={() => onRequestClose()}>
			<View style={styles.modalOverlay} />
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<Text style={styles.modalText}>{modalMessage}</Text>
					{buttons.map((button: TModalButton, index: number) => (
						<Button
							style={[
								(buttons.length - 1 != index) ? styles.modalButtonMB : {}, 
								button.style
							]}
							title={button.title}
							onPress={() => button.onPress()}
						/>))}
				</View>
			</View>
		</Modal>
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


