// @flow
import React, { Component } from 'react';

import logo from './logo.svg';
import './App.css';

window.defaultLocale = 'en';
window.locale = 'es';

const en = {
  common: {
    'Hello, world!': 'Hello, world!',
    'Goodbye, world...': 'Goodbye, world...'
  }
};

type Locales = $ReadOnly<{
  [l: string]: $ReadOnly<
  	$ObjMap<typeof en, <V>(V) => $ReadOnly<V>>
   >
}>;

const locales: Locales = {
  en,
  es: {
    common: {
      'Hello, world!': 'Hola, mundo!',
      'Goodbye, world...': 'Adios, mundo...'
    }
  }
}

function t<N: $Keys<typeof en>>(namespace: N, key: $Keys<$ElementType<typeof en, N>>): string {
  return (
    (locales[window.locale] && locales[window.locale][namespace][key]) ||
    (locales[window.defaultLocale] && locales[window.defaultLocale][namespace][key]) ||
    key
  );
};

class App extends Component<{}> {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          {t('common', 'Hello, world!')}
        </p>
      </div>
    );
  }
}

export default App;
