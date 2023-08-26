import React from 'react';

import {
	View,
	Modal,
	StyleSheet,
	StyleProp,
	ViewStyle,
	TouchableWithoutFeedback,
} from 'react-native';

interface IModalWithOverlayProps {
	animation: "none" | "fade" | "slide",
	children: React.ReactNode;
	show: boolean,
	onClose: () => void,
	overlayStyle?: StyleProp<ViewStyle>,
	transparent: boolean,
	onOverlayPress?: () => void,
}

export function ModalWithOverlay({
	children,
	animation,
	show,
	onClose,
	overlayStyle,
	transparent = false,
	onOverlayPress,
}: IModalWithOverlayProps): JSX.Element {
	const callBackOverlay = () => {
		if (onOverlayPress) onOverlayPress();
	}

	return (
		<Modal
			animationType={animation ?? "none"}
			transparent={transparent}
			visible={show}
			onRequestClose={() => onClose()}
		>
			<TouchableWithoutFeedback
				onPress={() => callBackOverlay()}

			>
				<View style={[styles.modalOverlay, overlayStyle]}>
				</View>
			</TouchableWithoutFeedback>
			{children}
		</Modal>
	);
}

const styles = StyleSheet.create({
	modalOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
});


