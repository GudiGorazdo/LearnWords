import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useObject, useRealm, useQuery } from '../../store/RealmContext';
import { Header } from '../../modules/Header';
import { GroupForm } from '../../modules/GroupForm';
import { TGroup } from '../../types';
import IconsStrings from '../../assets/awesomeIcons';
import Group from '../../store/models/Group';

import containerStyles from '../../styles/container';
import theme from '../../styles/themeLight';

import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	Text,
	TouchableOpacity,
} from 'react-native';

interface IWordsGroupsScreenProps {
	navigation: StackNavigationProp<any>,
}

export function WordsGroups({ navigation }: IWordsGroupsScreenProps): JSX.Element {
  const goupsList = useQuery(Group);
  console.log(goupsList[0].words);
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
			// await getGroups();
			// await getAllCount();
			// await getWordsWithoutGroups();
		} catch (error: any) {
			console.log(error);
		}
	}

	// const getGroups = async () => {
  //   const allArr: TGroup[] = await SWords.getGroups();
	// 	setGroups(allArr);
	// }

	// const getAllCount = async () => {
	// 	const count: number = await SWords.getDictionaryCount();
	// 	setDictionaryCount(count);
	// }

	// const getWordsWithoutGroups = async () => {
	// 	const count: number = await SWords.getWithoutGroupsCount();
	// 	setWithoutGroupsCount(count);
	// }

	const rowTemplate = (name: string, count: number, id?: string) => {
    console.log('work');
		return (
			<TouchableOpacity
				key={`group-${id ?? 'no-group'}`}
				style={[styles.rowContainer]}
				onPress={() => navigation.push(
					'WordsList',
					{
						groupID: id ?? null,
					}
				)}
			>
				<Text style={styles.text}>{name}</Text>
				<Text style={styles.text}>{count}</Text>
			</TouchableOpacity>
		);
	}

	return (
		<>
			<SafeAreaView style={styles.container}>
				<Header
					backPath={() => navigation.goBack()}
					rightIcon={{
						type: IconsStrings.plus,
						onPress: () => setGroupFormVisible(true),
					}}
				/>
				<ScrollView contentContainerStyle={[styles.scrollViewContent, containerStyles]}>
					{goupsList.map((group: Group) => rowTemplate(group.name, group.words?.length ?? 0, group._id.toString()))}
					{/* {rowTemplate('Все слова', dictionaryCount, 0)}
					{rowTemplate('Слова без групп', withoutGroupsCount)} */}
				</ScrollView>
			</SafeAreaView >
			{/* <GroupForm
				// navigation={navigation}
				onClose={() => setGroupFormVisible(false)}
				isVisible={isGroupFormVisible}
				onCreate={() => activateSwitchData(!switchData)}
			/> */}
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

  text: {
    color: theme.textColor,
  },
});


