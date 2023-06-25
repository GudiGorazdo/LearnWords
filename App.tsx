import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import Navigation from './src/navigation/Navigation';
// import type {PropsWithChildren} from 'react';
//
import SWords from './src/storage/words/words.service';

function App(): JSX.Element {
	const isDarkMode = useColorScheme() === 'dark';
	const x = SWords.getInstance();

	return (
		<>
			<StatusBar
				translucent
				barStyle={isDarkMode ? 'light-content' : 'dark-content'}
				backgroundColor="transparent"
			/>
			<Navigation />
		</>
	);
}



export default App;
