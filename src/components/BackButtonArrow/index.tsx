import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

interface IBackButtonArrowProps {
	backPath: () => void,
	style?: object,
}

export default function BackButtonArrow({ backPath, style }: IBackButtonArrowProps): JSX.Element {
	return (
		<TouchableOpacity
			style={[styles.backButtonArrow, style]}
			onPress={() => backPath()}
		>
			<Icon
				name="arrow-left"
				size={24}
			/>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	backButtonArrow: {
		padding: 10,
	},
});


