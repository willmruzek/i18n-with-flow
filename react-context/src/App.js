// @flow
import React, { Component, type Node } from 'react';
import createReactContext from 'create-react-context';

import logo from './logo.svg';
import './App.css';

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

const I18nContext = createReactContext({
  t: null,
  changeLocale: null
});

class TransProvider extends React.Component <{ children: Node }, { locale: $Keys<Locales> }> {
  state = { locale: 'en' };

  t = <N: $Keys<typeof en>>(
    namespace: N,
    key: $Keys<$ElementType<typeof en, N>>
  ): string => {
    const defaultLocale = 'en';
    const { locale } = this.state;
    return (
      (locales[locale] && locales[locale][namespace][key]) ||
      (locales[defaultLocale] && locales[defaultLocale][namespace][key]) ||
      key
    );
  };

  changeLocale = (locale: $Keys<Locales>) => this.setState({ locale });

  render() {
    return (
      <I18nContext.Provider value={{ t: this.t, changeLocale: this.changeLocale }}>
        {this.props.children}
      </I18nContext.Provider>
    );
  }
}

type Props<N: $Keys<typeof en>> = {
  namespace: N,
  id: $Keys<$ElementType<typeof en, N>>,
  children: (text: string) => Node
};

class Trans extends React.Component<Props<*>> {
  render() {
    const { namespace, id, children } = this.props;
    return (
      <I18nContext.Consumer>
        {({ t }) => {
          if (!t) throw new Error('Woops! It looks like you forgot to place TransProvider in your component tree.');
          return children(t(namespace, id));
        }}
      </I18nContext.Consumer>
    );
  }
}

class TransSelector extends React.Component<{}> {
  render() {
    return (
      <I18nContext.Consumer>
        {({ changeLocale }) => {
          return (
            <div>
              <button onClick={() => changeLocale && changeLocale('en')}>en</button>
              <button onClick={() => changeLocale && changeLocale('es')}>es</button>
            </div>
          );
        }}
      </I18nContext.Consumer>
    );
  }
}

class App extends Component<{}> {
  render() {
    return (
      <TransProvider>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <TransSelector />
          <p className="App-intro">
            <Trans
              namespace="common"
              id="Hello, world!">
              {(text) => {
                return text
              }}
            </Trans>
          </p>
        </div>
      </TransProvider>
    );
  }
}

export default App;
