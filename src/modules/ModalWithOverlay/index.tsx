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
	isVisible: boolean,
	overlayStyle?: StyleProp<ViewStyle>,
	transparent: boolean,
	style?: StyleProp<ViewStyle>,
	onOverlayPress?: () => void,
}

export function ModalWithOverlay({
	children,
	animation,
	isVisible,
	overlayStyle,
	transparent = false,
	style,
	onOverlayPress,
}: IModalWithOverlayProps): JSX.Element {
	return (
		<Modal
			style={style ?? {}}
			animationType={animation ?? "none"}
			transparent={transparent}
			visible={isVisible}
		>
			<TouchableWithoutFeedback onPress={() => { if (onOverlayPress) onOverlayPress(); }} >
				<View style={[styles.modalOverlay, overlayStyle]}/>
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


