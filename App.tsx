import React from 'react';
import {RealmProvider} from './src/store/RealmContext';
import {Application} from './src/app';

function App(): JSX.Element {
  return (
    <RealmProvider>
      <Application />
    </RealmProvider>
  );
}

export default App;
