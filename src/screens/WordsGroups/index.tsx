import React, { useState, useEffect, useRef } from 'react';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import { Header } from '../../modules/Header';
import { GroupForm } from '../../modules/GroupForm';
import SWords from '../../storage/words/words.service';
import { TGroup } from '../../storage/words/words.types';
import IconsStrings from '../../assets/awesomeIcons';

import containerStyles from '../../styles/container';

import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	Text,
	TouchableOpacity,
} from 'react-native';

interface IWordsGroupsScreenProps {
	navigation: NavigationProp<any>,
}

export function WordsGroups({ navigation }: IWordsGroupsScreenProps): JSX.Element {
	const [groups, setGroups] = useState<TGroup[]>([]);
	const [dictionaryCount, setDictionaryCount] = useState<number>(0);
	const [withoutGroupsCount, setWithoutGroupsCount] = useState<number>(0);
	const [isGroupFormVisible, setGroupFormVisible] = useState<boolean>(false);

	const [switchData, activateSwitchData] = useState<boolean>(false);

	useEffect(() => {
		getData();
	}, [switchData]);

	useFocusEffect(() => {
		getData();
	});

	const getData = async () => {
		try {
			await getGroups();
			await getAllCount();
			await getWordsWithoutGroups();
		} catch (error: any) {
			console.log(error);
		}
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
		<>
			<SafeAreaView style={styles.container}>
				<Header
					backPath={() => navigation.navigate('Home')}
					rightIcon={{
						type: IconsStrings.plus,
						onPress: () => setGroupFormVisible(true),
					}}
				/>
				<ScrollView contentContainerStyle={[styles.scrollViewContent, containerStyles]}>
					{groups.map((group: TGroup) => rowTemplate(group.name, group.count ?? 0, group.id))}
					{rowTemplate('Все слова', dictionaryCount, 0)}
					{rowTemplate('Слова без групп', withoutGroupsCount)}
				</ScrollView>
			</SafeAreaView >
			<GroupForm
				navigation={navigation}
				onClose={() => setGroupFormVisible(false)}
				isVisible={isGroupFormVisible}
				onCreate={() => activateSwitchData(!switchData)}
			/>
		</>
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
});


