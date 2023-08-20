import React, { useState, useEffect } from 'react';
import { useFocusEffect, NavigationProp } from '@react-navigation/native';
import { Header } from '../../modules/Header';
import { Button } from '../../components/Button';
import { ModalWindow, TModalButton } from '../../modules/ModalWindow';
import SWords from '../../storage/words/words.service';
import { TTranslate, TWord, TGroup } from '../../storage/words/words.types';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconsStrings from '../../assets/awesomeIcons';

import containerStyles from '../../styles/container';

import {
	SafeAreaView,
	View,
	StyleSheet,
	ScrollView,
	Text,
	TouchableOpacity,
	Modal,
} from 'react-native';

interface IWordsGroupsScreenProps {
	navigation: NavigationProp<any>,
}

export function WordsGroups({ navigation }: IWordsGroupsScreenProps): JSX.Element {
	const [groups, setGroups] = useState<TGroup[]>([]);
	const [dictionaryCount, setDictionaryCount] = useState<number>(0);
	const [withoutGroupsCount, setWithoutGroupsCount] = useState<number>(0);
	const [showForm, setShowForm] = useState<boolean>(false);
	const [start, setStart] = useState<boolean>(true);

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		await getGroups();
		await getAllCount();
		await getWordsWithoutGroups();
	}

	const getGroups = async () => {
		const allArr: TGroup[] = await SWords.getGroups();
		setGroups(allArr);
	}

	const getAllCount = async () => {
		const count: number = await SWords.getDictionaryCount();
		setDictionaryCount(count);
	}

	const getWordsWithoutGroups = async () => {
		const count: number = await SWords.getWithoutGroupsCount();
		setWithoutGroupsCount(count);
	}

	const onCloseForm = () => { }

	const rowTemplate = (name: string, count: number, id?: number) => {
		return (
			<TouchableOpacity
				key={`group-${id ?? 'no-group'}`}
				style={[styles.rowContainer]}
				onPress={() => navigation.navigate(
					'WordsList',
					{
						backPathRoute: 'WordsGroups',
						groupID: id ?? 'null',
					}
				)}
			>
				<Text>{name}</Text>
				<Text>{count}</Text>
			</TouchableOpacity>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<Header
				backPath={() => navigation.navigate('Home')}
				rightIcon={{
					type: IconsStrings.plus,
					onPress: () => {
						setShowForm(true);
					},
				}}
			/>
			<ScrollView contentContainerStyle={[styles.scrollViewContent, containerStyles]}>
				{groups.map((group: TGroup) => rowTemplate(group.name, group.count, group.id))}
				{rowTemplate('Все слова', dictionaryCount, 0)}
				{rowTemplate('Слова без групп', withoutGroupsCount)}
			</ScrollView>
			<Modal
				animationType="fade"
				transparent={true}
				visible={showForm}
				onRequestClose={() => onCloseForm()}
			>
				<Button
					title='Закрыть'
					onPress={() => setShowForm(false)}
				/>
			</Modal>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	scrollViewContent: {
		flexGrow: 1,
	},

	rowContainer: {
		marginBottom: 10,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	wordContainer: {
		flexGrow: 1,
		paddingVertical: 10,
	},

	removeButton: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'transparent',
	},
});


