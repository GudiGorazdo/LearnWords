import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

interface IBackButtonArrowProps {
	accept: () => void,
	style?: object,
}

export default function BackButtonArrow({ accept, style }: IBackButtonArrowProps): JSX.Element {
	return (
		<TouchableOpacity
			style={[styles.acceptButton, style]}
			onPress={() => accept()}
		>
			<Icon
				name="check"
				size={24}
			/>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	acceptButton: {
		padding: 10,
	},
});


