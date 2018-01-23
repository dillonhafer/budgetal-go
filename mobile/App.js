import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  Platform,
  Linking,
} from 'react-native';
import { Constants, ScreenOrientation } from 'expo';
import qs from 'qs';
import Device from 'utils/Device';

// Redux
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from 'reducers';
const store = createStore(reducers);

// App
import RootNavigator from 'navigators/root';
import registerForPushNotifications from 'utils/registerForPushNotifications';
StatusBar.setBarStyle('light-content', true);

// Linking
const prefix =
  Platform.OS == 'android'
    ? `${Constants.linkingUri}://${Constants.linkingUri}/`
    : `${Constants.linkingUri}://`;

// Allow iPads to use landscape
if (Platform.OS === 'ios' && Device.isTablet()) {
  ScreenOrientation.allow(ScreenOrientation.Orientation.ALL);
} else {
  ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT_UP);
}

// Preload font icons
import { AppLoading, Asset, Font } from 'expo';
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';

// Cache functions
function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

export default class App extends Component {
  state = {
    preLoaded: false,
    orientation: Device.isPortrait() ? 'portrait' : 'landscape',
    devicetype: Device.isTablet() ? 'tablet' : 'phone',
  };

  componentWillMount() {
    registerForPushNotifications();
  }

  componentDidMount() {
    Linking.addEventListener('url', this._handleOpenURL);
    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: Device.isPortrait() ? 'portrait' : 'landscape',
      });
    });
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL);
  }

  _handleOpenURL = ({ url }) => {
    let queryString = url.replace(Constants.linkingUri, '');
    if (queryString) {
      const { reset_password_token } = qs.parse(queryString);
      if (reset_password_token && reset_password_token.length) {
        Linking.openURL(
          `${Constants.linkingUri}://reset-password/${reset_password_token}`,
        );
      }
    }
  };

  async loadAssetsAsync() {
    const imageAssets = cacheImages([
      require('images/app_logo.png'),
      require('images/csv.png'),
      require('images/Charity.png'),
      require('images/Saving.png'),
      require('images/Housing.png'),
      require('images/Utilities.png'),
      require('images/Food.png'),
      require('images/Clothing.png'),
      require('images/Transportation.png'),
      require('images/Health.png'),
      require('images/Insurance.png'),
      require('images/Personal.png'),
      require('images/Recreation.png'),
      require('images/Debts.png'),
    ]);

    const fontAssets = cacheFonts([
      FontAwesome.font,
      Ionicons.font,
      MaterialCommunityIcons.font,
      Feather.font,
    ]);
    await Promise.all([...imageAssets, ...fontAssets]);
  }

  onFinish = () => {
    this.setState({ preLoaded: true });
  };

  render() {
    if (!this.state.preLoaded) {
      return (
        <AppLoading
          startAsync={this.loadAssetsAsync}
          onFinish={this.onFinish}
          onError={console.warn}
        />
      );
    }

    return [
      <View
        key="spacer"
        style={{
          width: '100%',
          backgroundColor: '#000',
          height: Platform.OS === 'ios' ? 0 : 24,
        }}
      />,
      <Provider key="app" store={store}>
        <RootNavigator uriPrefix={prefix} />
      </Provider>,
    ];
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
