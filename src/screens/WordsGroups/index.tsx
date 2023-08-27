import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect, NavigationProp } from '@react-navigation/native';
import { Header } from '../../modules/Header';
import { Button } from '../../components/Button';
import { ModalWithOverlay } from '../../modules/ModalWithOverlay';
import { Alert, TAlertButton } from '../../modules/Alert';
import { GroupForm } from '../../modules/GroupForm';
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
	Animated,
	Easing,
} from 'react-native';

interface IWordsGroupsScreenProps {
	navigation: NavigationProp<any>,
}

export function WordsGroups({ navigation }: IWordsGroupsScreenProps): JSX.Element {
	const animationFormDuration: number = 200;

	const [groups, setGroups] = useState<TGroup[]>([]);
	const [dictionaryCount, setDictionaryCount] = useState<number>(0);
	const [withoutGroupsCount, setWithoutGroupsCount] = useState<number>(0);
	const [isGroupFormVisible, setGroupFormVisible] = useState<boolean>(false);
	const [isShowForm, setShowForm] = useState<boolean>(false);

	const [newGroupData, setNewGroupData] = useState<TGroup | null>(null);
	const [isAlertVisible, setAlertVisible] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>('');
	const [isError, setError] = useState<boolean>(false);

	const [animationForm] = useState(new Animated.Value(0));
	const [animatedFormViewHeight, setAnimatedFormViewHeight] = useState(0);
	const animatedFormViewRef = useRef(null);


	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		console.log(isAlertVisible);
	}, [isAlertVisible]);

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

	const formAnimation = () => {
		Animated.timing(animationForm, {
			toValue: isShowForm ? 0 : 1,
			duration: animationFormDuration,
			useNativeDriver: true,
			easing: Easing.ease,
		}).start(() => setShowForm(!isShowForm));
	}

	const translateY = animationForm.interpolate({
		inputRange: [0, 1],
		outputRange: [animatedFormViewHeight, 0],
	});

	const animatedStyle = {
		transform: [
			{
				translateY: translateY,
			},
		],
	}

	const onCloseForm = () => { }

	const onLayoutForm = () => {
		if (animatedFormViewRef.current) {
			animatedFormViewRef.current.measure((x, y, width, height) => {
				setAnimatedFormViewHeight(height);
			});
		}
	}

	const saveNewGroup = async (): Promise<string | number> => {
		return new Promise<string | number>((resolve, reject) => {
			try {
				const result = SWords.createGroup(newGroupData.name, newGroupData.description);
				resolve(result);
			} catch (error: any) {
				reject(error);
			}
		});
	}

	const submitGroupForm = async () => {
		console.log('work!');
		if (!newGroupData || !newGroupData.name) {
			setError(true);
			setAlertMessage('Введите название группы');
			setAlertVisible(true);
			return;
		}
		// const result = await saveNewGroup();
		// if (result === 'duplicate') {
		// 	setAlertMessage('Группа с таким названием уже существует!');
		// 	setError(true);
		// 	setAlertVisible(true);
		// }
		// console.log(result);
	}

	const openGroupForm = () => {
		setGroupFormVisible(true);
		setTimeout(() => formAnimation(), animationFormDuration);
	}

	const closeGroupForm = () => {
		formAnimation();
		setTimeout(() => setGroupFormVisible(false), animationFormDuration);
	}

	const getAlertButtons = (): TAlertButton[] => {
		const buttons: TAlertButton[] = [{
			title: 'Закрыть',
			onPress: () => {
				setAlertVisible(!isAlertVisible);
				if (isError) setError(false);
			}
		}];
		if (!isError) {
			buttons.push({
				title: 'Добавить слова в список',
				onPress: () => {
					setAlertVisible(!isAlertVisible);
					navigation.navigate('WordData', { backPathRoute: 'Words', isShowWord: false });
				}
			});
		}
		return buttons;
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
						onPress: () => openGroupForm(),
					}}
				/>
				<ScrollView contentContainerStyle={[styles.scrollViewContent, containerStyles]}>
					{groups.map((group: TGroup) => rowTemplate(group.name, group.count ?? 0, group.id))}
					{rowTemplate('Все слова', dictionaryCount, 0)}
					{rowTemplate('Слова без групп', withoutGroupsCount)}
				</ScrollView>
			</SafeAreaView >
			<Alert
				style={styles.alert}
				isVisible={isAlertVisible}
				message={alertMessage}
				buttons={getAlertButtons()}
				onOverlayPress={() => setAlertVisible(false)}
			/>
			<ModalWithOverlay
				animation="fade"
				transparent={true}
				isVisible={isGroupFormVisible}
				onOverlayPress={() => closeGroupForm()}
			>
				<Animated.View
					style={[styles.groupForm, animatedStyle]}
					ref={animatedFormViewRef}
					onLayout={() => onLayoutForm()}
				>
					<GroupForm getNewGroupData={(data: TGroup) => setNewGroupData(data)} />
					<View style={containerStyles}>
						<Button
							style={{ marginBottom: 15 }}
							title='Сохранить'
							onPress={() => submitGroupForm()}
						/>
						<Button
							title='Отменить'
							onPress={() => closeGroupForm()}
						/>
					</View>
				</Animated.View>
			</ModalWithOverlay>
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

	groupForm: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: '100%',
		paddingBottom: 50,
		backgroundColor: 'white',
		zIndex: 100,
	},

	alert: {
		zIndex: 101,
	}
});


