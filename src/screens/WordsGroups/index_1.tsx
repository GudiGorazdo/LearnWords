import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect, NavigationProp } from '@react-navigation/native';
import { Header } from '../../modules/Header';
import { Button } from '../../components/Button';
import { ModalWithOverlay } from '../../modules/ModalWithOverlay';
import { GroupForm } from '../../modules/GroupForm';
import SWords from '../../storage/words/words.service';
import { TTranslate, TWord, TGroup } from '../../storage/words/words.types';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconsStrings from '../../assets/awesomeIcons';

import containerStyles from '../../styles/container';

import Animated, {
	Easing,
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withTiming,
} from 'react-native-reanimated';

import {
	SafeAreaView,
	View,
	StyleSheet,
	ScrollView,
	Text,
	TouchableOpacity,
	// Animated,
} from 'react-native';

interface IWordsGroupsScreenProps {
	navigation: NavigationProp<any>,
}

export function WordsGroups({ navigation }: IWordsGroupsScreenProps): JSX.Element {
	const animationFormDuration: number = 300;

	const [groups, setGroups] = useState<TGroup[]>([]);
	const [dictionaryCount, setDictionaryCount] = useState<number>(0);
	const [withoutGroupsCount, setWithoutGroupsCount] = useState<number>(0);
	const [isShowModal, setShowModal] = useState<boolean>(false);
	const [isShowForm, setShowForm] = useState<boolean>(false);
	const [start, setStart] = useState<boolean>(true);
	const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);

	// const [animationForm] = useState(new Animated.Value(0));
	const [animatedFormViewHeight, setAnimatedFormViewHeight] = useState(0);
	const animatedFormViewRef = useRef(null);
	const animationFormValue = useSharedValue(0);


	useEffect(() => {
		getData();
	}, []);
	
	useEffect(() => {
		console.log('yes');
		formAnimation();
	}, [isShowModal]);

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
		animationFormValue.value = !isShowModal ? 1 : 0;
	}

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: withTiming(
						(animatedFormViewHeight),
						{
							duration: 300,
							easing: Easing.bezier(0.25, 0.1, 0.25, 1)
						}
					),
				},
			],
		};
	});

	const onCloseForm = () => { }

	const onLayoutForm = () => {
		if (animatedFormViewRef.current) {
			animatedFormViewRef.current.measure((x, y, width, height) => {
				setAnimatedFormViewHeight(height);
			});
		}
	};

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
						setShowModal(true);
					},
				}}
			/>
			<ScrollView contentContainerStyle={[styles.scrollViewContent, containerStyles]}>
				{groups.map((group: TGroup) => rowTemplate(group.name, group.count ?? 0, group.id))}
				{rowTemplate('Все слова', dictionaryCount, 0)}
				{rowTemplate('Слова без групп', withoutGroupsCount)}
			</ScrollView>
			<ModalWithOverlay
				animation="fade"
				transparent={true}
				show={isShowModal}
				onClose={() => onCloseForm()}
				onOverlayPress={() => {
					setShowModal(false);
				}}
			>
				<Animated.View
					style={[{bottom: animatedFormViewHeight}, styles.groupForm, animatedStyle]}
					ref={animatedFormViewRef}
					onLayout={() => onLayoutForm()}
				>
					<GroupForm />
					<View style={containerStyles}>
						<Button
							style={{ marginBottom: 15 }}
							title='Сохранить'
							onPress={() => { }}
						/>
						<Button
							title='Отменить'
							onPress={() => {
								setShowModal(false);
							}}
						/>
					</View>
				</Animated.View>
			</ModalWithOverlay>
		</SafeAreaView >
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
		// bottom: 0,
		left: 0,
		width: '100%',
		paddingBottom: 50,
		backgroundColor: 'white',
		zIndex: 100,
	}
});


