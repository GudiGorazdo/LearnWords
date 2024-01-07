import React from 'react';
// import {StatusBar, useColorScheme} from 'react-native';
import Navigation from '../navigation/Navigation';
import {useQuery, useRealm} from '../store/RealmContext';
import Config from '../store/models/Config';
import setup from '../store/setup';

export const Application = (): JSX.Element => {
  // const isDarkMode = useColorScheme() === 'dark';
  const realm = useRealm();
  const config = useQuery(Config);

  if (config.length === 0) {
    setup(realm);
  }

  return (
    <>
      {/* <StatusBar
        translucent
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
      /> */}
      <Navigation />
    </>
  );
};
