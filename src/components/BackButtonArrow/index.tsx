import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

interface IBackButtonArrowProps {
	backPath: () => void,
}

export default function BackButtonArrow({ backPath }: IBackButtonArrowProps): JSX.Element {
	return (
		<TouchableOpacity
			style={styles.backButtonArrow}
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
		height: '100%',
		paddingRight: 10,
		justifyContent: 'center',
	},
});


