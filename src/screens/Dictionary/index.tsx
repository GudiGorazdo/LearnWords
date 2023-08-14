import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import { CenteredContent } from '../../modules/CenteredContent';
import { Button } from '../../components/Button';

interface IDictionaryScreenProps {
	navigation: NavigationProp<any>,
}

export const Dictionary = ({ navigation }: IDictionaryScreenProps): JSX.Element => {
	return (
		<CenteredContent navigation={navigation} header={true}>
			<Button 
				title='Добавить' 
				onPress={() => navigation.navigate('WordData', { backPathRoute: 'Dictionary', wordEdit: false })} 
			/>
			<Button title='Редактировать' onPress={() => navigation.navigate('Edit')} />
		</CenteredContent>
	);
};


