import React, { Component } from "react";
import { View, StatusBar, Dimensions, Platform } from "react-native";
import { ScreenOrientation, AppLoading, Linking } from "expo";
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

import { Ionicons } from "@expo/vector-icons";
import { preloadAssetsAsync } from "@src/utils/preload-assets";

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
    const name = {
      info: "ios-information-circle-outline",
      error: "ios-alert",
      success: "ios-checkmark-circle-outline",
      custom: "ios-construct",
    }[this.dropdown.state.type];

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
          startAsync={preloadAssetsAsync}
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
              containerStyle={{ backgroundColor: "purple" }}
              ref={ref => (this.dropdown = ref)}
            />
          </React.Fragment>
        </Provider>
      </ApolloProvider>
    );
  }
}
