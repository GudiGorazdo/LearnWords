/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { View, StatusBar, useColorScheme } from 'react-native';
import Navigation from './src/navigation/Navigation';
// import type {PropsWithChildren} from 'react';

function App(): JSX.Element {
	const isDarkMode = useColorScheme() === 'dark';

	return <Navigation />;
}



export default App;
