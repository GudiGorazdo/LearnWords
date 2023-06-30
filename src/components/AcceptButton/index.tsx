import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

interface IBackButtonArrowProps {
	accept: () => void,
}

export default function BackButtonArrow({ accept }: IBackButtonArrowProps): JSX.Element {
	return (
		<TouchableOpacity
			style={styles.acceptButton}
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
		height: '100%',
		paddingRight: 10,
		justifyContent: 'center',
	},
});


