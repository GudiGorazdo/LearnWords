
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
	TouchableOpacity,
} from 'react-native';

interface IBackButtonProps {
	backPath: () => void,
}

export default function BackButton({ backPath }: IBackButtonProps): JSX.Element {
	return (
		<TouchableOpacity
			style={{
				height: '100%',
				paddingRight: 10,
				justifyContent: 'center',
			}}
			onPress={() => backPath()}
		>
			<Icon
				name="arrow-left"
				size={24}
			/>
		</TouchableOpacity>
	);
}


