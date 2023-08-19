import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '../../screens/Home';

import { Dictionary } from '../../screens/Dictionary';
import { WordData } from '../../screens/WordData';
import { Edit } from '../../screens/Edit';

import { Training } from '../../screens/Training';
import { Test } from '../../screens/Test';

const Stack = createNativeStackNavigator();

export default function Navigation(): JSX.Element {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />

				<Stack.Screen name="Dictionary" component={Dictionary} options={{ headerShown: false }} />
				<Stack.Screen name="WordData" component={WordData} options={{ headerShown: false }} />
				<Stack.Screen name="Edit" component={Edit} options={{ headerShown: false }} />

				<Stack.Screen name="Training" component={Training} options={{ headerShown: false }} />
				<Stack.Screen name="Test" component={Test} options={{ headerShown: false }} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}


