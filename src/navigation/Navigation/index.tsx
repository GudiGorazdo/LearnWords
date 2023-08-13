import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '../../screens/Home';
import { Words } from '../../screens/Words';
import { WordData } from '../../screens/WordData';
import { Repeat } from '../../screens/Repeat';
import { Edit } from '../../screens/Edit';

const Stack = createNativeStackNavigator();

export default function Navigation(): JSX.Element {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
				<Stack.Screen name="Words" component={Words} options={{ headerShown: false }} />
				<Stack.Screen name="WordData" component={WordData} options={{ headerShown: false }} />
				<Stack.Screen name="Repeat" component={Repeat} options={{ headerShown: false }} />
				<Stack.Screen name="Edit" component={Edit} options={{ headerShown: false }} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}


