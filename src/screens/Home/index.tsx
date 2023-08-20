import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import { CenteredContent } from '../../modules/CenteredContent';
import { Button } from '../../components/Button';

interface IHomeScreenProps {
	navigation: NavigationProp<any>,
}

export const Home = ({ navigation }: IHomeScreenProps): JSX.Element => {
	return (
		<CenteredContent navigation={navigation}>
			<Button
				title='Добавить'
				onPress={() => navigation.navigate(
					'WordData',
					{
						backPathRoute: 'Home',
						wordShow: false,
						wordEdit: true,
						wordNew: true,
					}
				)}
			/>
			<Button title='Группы слов' onPress={() => navigation.navigate('WordsGroups')} />
			<Button title='Тренировка' onPress={() => navigation.navigate('Training')} />
			<Button 
				title='Все слова' 
				onPress={() => navigation.navigate('WordsList', {backPathRoute: 'Home'})} 
			/>
		</CenteredContent>
	);
};

// import React from 'react';
// import { NavigationProp } from '@react-navigation/native';
// import { observer } from 'mobx-react-lite';
//
// import { CenteredContent } from '../../modules/CenteredContent';
// import { Button } from '../../components/Button';
//
// interface IHomeScreenProps {
// 	navigation: NavigationProp<any>,
// }
//
// export const Home = observer(({ navigation }: IHomeScreenProps): JSX.Element => {
// 	return (
// 		<CenteredContent navigation={navigation}>
// 			<Button title='Тренировка' onPress={() => navigation.navigate('Training')} />
// 			<Button title='Словарь' onPress={() => navigation.navigate('Dictionary')} />
// 		</CenteredContent>
// 	);
// })


