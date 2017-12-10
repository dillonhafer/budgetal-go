import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

// Redux
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from 'reducers';
const store = createStore(reducers);

// App
import RootNavigator from 'navigators/root';
StatusBar.setBarStyle('light-content', true);

// Preload font icons
import { AppLoading, Asset, Font } from 'expo';
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

export default class App extends Component {
  state = {
    fontsLoaded: false,
  };

  async loadAssetsAsync() {
    const fontAssets = cacheFonts([
      FontAwesome.font,
      Ionicons.font,
      MaterialCommunityIcons.font,
    ]);
    await Promise.all(fontAssets);
  }

  onFinish = () => {
    this.setState({ fontsLoaded: true });
  };

  render() {
    if (!this.state.fontsLoaded) {
      return (
        <AppLoading
          startAsync={this.loadAssetsAsync}
          onFinish={this.onFinish}
          onError={console.warn}
        />
      );
    }

    return (
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
