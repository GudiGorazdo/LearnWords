import React, { useState, useEffect } from 'react';
import { useFocusEffect, NavigationProp } from '@react-navigation/native';
import { Header } from '../../modules/Header';
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
} from 'react-native';

interface IWordsGroupsScreenProps {
	navigation: NavigationProp<any>,
}

export function WordsGroups({ navigation }: IWordsGroupsScreenProps): JSX.Element {
	const [groups, setGroups] = useState<TGroup[]>([]);

	useFocusEffect(() => {
		getGroups();
	});

	const getGroups = async () => {
		const groupsArr: TGroup[] = await SWords.getGroups();
		setGroups(groupsArr);
	}

	return (
		<SafeAreaView style={styles.container}>
			<Header backPath={() => navigation.navigate('Dictionary')} />
			<ScrollView contentContainerStyle={[styles.scrollViewContent, containerStyles]}>
				{groups.map((group, index) => (
					<TouchableOpacity 
						key={`group-${group.id}`}
						style={[styles.rowContainer]}
						onPress={() => console.log('press ', group.id)}
					>
						<Text>{group.name}</Text>
						<Text>{group.count}</Text>
					</TouchableOpacity>
				))}
			</ScrollView>
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


