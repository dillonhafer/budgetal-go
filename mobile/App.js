import React, { Component } from 'react';
import { View, StatusBar, Dimensions, Platform, Linking } from 'react-native';
import { Constants, ScreenOrientation, AppLoading, Asset, Font } from 'expo';
import qs from 'qs';
import Device from 'utils/Device';

// Redux
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducers from 'reducers';
import apiMiddleware from 'api/middleware';
const store = createStore(reducers, {}, applyMiddleware(apiMiddleware));

// App
import colors from 'utils/colors';
import DropdownAlert from 'react-native-dropdownalert';
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
    delay: 1000,
    preLoaded: false,
    orientation: Device.isPortrait() ? 'portrait' : 'landscape',
    devicetype: Device.isTablet() ? 'tablet' : 'phone',
  };

  componentDidMount() {
    registerForPushNotifications();
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
      require('images/onepassword.png'),
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
    global.alertWithType = this.alertWithType;
  };

  alertWithType = (type, title, message, options = {}) => {
    const originalDelay = this.state.delay;
    if (options.delay) {
      this.setState({ delay: options.delay });
    }

    this.dropdown.alertWithType(type, title, message);

    if (options.delay) {
      setTimeout(() => {
        this.setState({ delay: originalDelay });
      }, options.delay);
    }
  };

  renderAlertImage = () => {
    const isError = this.dropdown.state.type === 'error';
    const name = isError ? 'ios-alert-outline' : 'ios-checkmark-circle-outline';
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={name} size={32} color={'#fff'} />
      </View>
    );
  };

  render() {
    if (!this.state.preLoaded) {
      return (
        <AppLoading
          startAsync={this.loadAssetsAsync}
          onFinish={this.onFinish}
          onError={console.warn} // eslint-disable-line no-console
        />
      );
    }

    return (
      <Provider store={store}>
        <React.Fragment>
          <RootNavigator uriPrefix={prefix} />
          <DropdownAlert
            closeInterval={this.state.delay}
            renderImage={this.renderAlertImage}
            successColor={colors.success + 'f9'}
            errorColor={colors.error + 'f9'}
            ref={ref => (this.dropdown = ref)}
          />
        </React.Fragment>
      </Provider>
    );
  }
}
