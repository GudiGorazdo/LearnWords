import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '../../screens/Home';
import { Add } from '../../screens/Add';
import { Repeat } from '../../screens/Repeat';
import { Remove } from '../../screens/Remove';

const Stack = createNativeStackNavigator();

export default function Navigation(): JSX.Element {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
				<Stack.Screen name="Add" component={Add} options={{ headerShown: false }} />
				<Stack.Screen name="Repeat" component={Repeat} options={{ headerShown: false }} />
				<Stack.Screen name="Remove" component={Remove} options={{ headerShown: false }} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}


