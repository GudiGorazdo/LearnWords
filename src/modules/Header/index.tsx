import React, { RefObject } from 'react';
import { StatusBar, Platform } from 'react-native';
import BackButtonArrow from '../../components/BackButtonArrow';
import AcceptButton from '../../components/AcceptButton';
import containerStyles from '../../styles/container';

import {
	SafeAreaView,
	View,
	StyleSheet,
} from 'react-native';

interface IHeaderScreenProps {
	innerRef?: RefObject<View>,
	style?: object;
	backPath?: () => void;
	accept?: () => void;
}

const getStatusBarMargin = (): number => {
	const statusBarHeight = StatusBar.currentHeight ?? 0;
	return Platform.OS === 'android' ? statusBarHeight : 0;
};

const HeaderComponent = ({
	innerRef,
	style,
	backPath,
	accept
}: IHeaderScreenProps): JSX.Element => {
	return (
		<SafeAreaView>
			<View ref={innerRef} style={[styles.header, style]}>
				{backPath && <BackButtonArrow style={{ paddingLeft: 0 }} backPath={() => backPath()} />}
				{accept && <AcceptButton style={{ paddingRight: 0 }} accept={() => accept()} />}
			</View>
		</SafeAreaView>
	);
};

export const Header = React.forwardRef<View, IHeaderScreenProps>((props, ref) => (
	<HeaderComponent {...props} innerRef={ref} />
));

const styles = StyleSheet.create({
	header: {
		marginTop: getStatusBarMargin(),
		height: 50,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		...containerStyles,
	},
});


