import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';

import { CenteredContent } from '../../modules/CenteredContent';
import { Button } from '../../components/Button';

interface IHomeScreenProps {
	navigation: NavigationProp<any>,
}

export const Home = observer(({ navigation }: IHomeScreenProps): JSX.Element => {
	return (
		<CenteredContent navigation={navigation}>
			<Button title='Повторять' onPress={() => navigation.navigate('Repeat')} />
			<Button title='Словарь' onPress={() => navigation.navigate('Dictionary')} />
		</CenteredContent>
	);
})


