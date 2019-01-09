import React, { Component } from 'react';
import { View, StatusBar, Dimensions, Platform, Linking } from 'react-native';
import { Constants, ScreenOrientation, AppLoading, Asset, Font } from 'expo';
import Device from 'utils/Device';
import queryString from 'utils/queryString';

// Redux
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducers from 'reducers';
import apiMiddleware from 'api/middleware';
const store = createStore(reducers, applyMiddleware(thunk, apiMiddleware));

// App
import { colors } from '@shared/theme';
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
    Dimensions.addEventListener('change', this._handleDimensionalShifts);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this._handleDimensionalShifts);
    Linking.removeEventListener('url', this._handleOpenURL);
  }

  _handleDimensionalShifts = () => {
    this.setState({
      orientation: Device.isPortrait() ? 'portrait' : 'landscape',
    });
  };

  _handleOpenURL = ({ url }) => {
    let qs = url.replace(Constants.linkingUri, '');
    if (qs) {
      const { reset_password_token } = queryString(qs);
      if (reset_password_token && reset_password_token.length) {
        Linking.openURL(
          `${Constants.linkingUri}://reset-password/${reset_password_token}`,
        );
      }
    }
  };

  async loadAssetsAsync() {
    let imageAssets = [];

    // eslint-disable-next-line no-undef
    if (__DEV__) {
      imageAssets = cacheImages([
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
    }

    const fontAssets = cacheFonts([
      FontAwesome.font,
      Ionicons.font,
      MaterialCommunityIcons.font,
      Feather.font,
      { 'Montserrat-Bold': require('fonts/Montserrat-Bold.ttf') },
      { 'Montserrat-Italic': require('fonts/Montserrat-Italic.ttf') },
      { 'Montserrat-Light': require('fonts/Montserrat-Light.ttf') },
      { 'Montserrat-Medium': require('fonts/Montserrat-Medium.ttf') },
      {
        'Montserrat-MediumItalic': require('fonts/Montserrat-MediumItalic.ttf'),
      },
      { 'Montserrat-Regular': require('fonts/Montserrat-Regular.ttf') },
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
    const style = {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: Platform.OS === 'ios' ? 0 : 20,
    };

    return (
      <View style={style}>
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
