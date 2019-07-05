import React, { Component } from "react";
import { View, StatusBar, Dimensions, Platform } from "react-native";
import { ScreenOrientation, AppLoading, Linking } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import Device from "@src/utils/Device";

// Redux
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import reducers from "@src/reducers";
import apiMiddleware from "@src/api/middleware";

// App
import { colors } from "@shared/theme";
import DropdownAlert from "react-native-dropdownalert";
import RootNavigator from "@src/navigators/root";
import registerForPushNotifications from "@src/utils/registerForPushNotifications";
import { ApolloProvider } from "react-apollo";
import { createApolloClient } from "@src/utils/apollo";
const client = createApolloClient();

StatusBar.setBarStyle("light-content", true);
const store = createStore(reducers, applyMiddleware(thunk, apiMiddleware));
// Linking
const prefix = Linking.makeUrl("/");

// Allow iPads to use landscape
if (Platform.OS === "ios" && Device.isTablet()) {
  ScreenOrientation.lockAsync(ScreenOrientation.Orientation.ALL);
} else {
  ScreenOrientation.lockAsync(ScreenOrientation.Orientation.PORTRAIT_UP);
}

// Preload font icons
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";

// Cache functions
function cacheImages(images) {
  return images.map(image => {
    if (typeof image === "string") {
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
    orientation: Device.isPortrait() ? "portrait" : "landscape",
    devicetype: Device.isTablet() ? "tablet" : "phone",
  };

  componentDidMount() {
    registerForPushNotifications();
    Dimensions.addEventListener("change", this._handleDimensionalShifts);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this._handleDimensionalShifts);
  }

  _handleDimensionalShifts = () => {
    this.setState({
      orientation: Device.isPortrait() ? "portrait" : "landscape",
    });
  };

  async loadAssetsAsync() {
    let imageAssets = [];

    // eslint-disable-next-line no-undef
    if (__DEV__) {
      imageAssets = cacheImages([
        require("@src/assets/images/app_logo.png"),
        require("@src/assets/images/csv.png"),
        require("@src/assets/images/Charity.png"),
        require("@src/assets/images/Saving.png"),
        require("@src/assets/images/Housing.png"),
        require("@src/assets/images/Utilities.png"),
        require("@src/assets/images/Food.png"),
        require("@src/assets/images/Clothing.png"),
        require("@src/assets/images/Transportation.png"),
        require("@src/assets/images/Health.png"),
        require("@src/assets/images/Insurance.png"),
        require("@src/assets/images/Personal.png"),
        require("@src/assets/images/Recreation.png"),
        require("@src/assets/images/Debts.png"),
        require("@src/assets/images/onepassword.png"),
      ]);
    }

    const fontAssets = cacheFonts([
      FontAwesome.font,
      Ionicons.font,
      MaterialCommunityIcons.font,
      Feather.font,
      { "Lato-Light": require("@src/assets/fonts/Lato-Light.ttf") },
      { "Lato-Medium": require("@src/assets/fonts/Lato-Medium.ttf") },
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
    const isError = this.dropdown.state.type === "error";
    const name = isError ? "ios-alert" : "ios-checkmark-circle-outline";
    const style = {
      alignItems: "center",
      justifyContent: "center",
      marginTop: Platform.OS === "ios" ? 0 : 20,
    };

    return (
      <View style={style}>
        <Ionicons name={name} size={32} color={"#fff"} />
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
      <ApolloProvider client={client}>
        <Provider store={store}>
          <React.Fragment>
            <RootNavigator uriPrefix={prefix} />
            <DropdownAlert
              closeInterval={this.state.delay}
              renderImage={this.renderAlertImage}
              successColor={colors.success + "f9"}
              errorColor={colors.error + "f9"}
              ref={ref => (this.dropdown = ref)}
            />
          </React.Fragment>
        </Provider>
      </ApolloProvider>
    );
  }
}
