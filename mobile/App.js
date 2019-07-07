import apiMiddleware from "@src/api/middleware";
import DropdownAlert from "@src/components/DropDownAlert";
import RootNavigator from "@src/navigators/root";
import reducers from "@src/reducers";
import { createApolloClient } from "@src/utils/apollo";
import Device from "@src/utils/Device";
import { preloadAssetsAsync } from "@src/utils/preload-assets";
import registerForPushNotifications from "@src/utils/registerForPushNotifications";
import { AppLoading, Linking, ScreenOrientation } from "expo";
import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import { Dimensions, Platform, StatusBar } from "react-native";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

StatusBar.setBarStyle("light-content", true);

const client = createApolloClient();
const store = createStore(reducers, applyMiddleware(thunk, apiMiddleware));
const prefix = Linking.makeUrl("/");

// Allow iPads to use landscape
if (Platform.OS === "ios" && Device.isTablet()) {
  ScreenOrientation.lockAsync(ScreenOrientation.Orientation.ALL);
} else {
  ScreenOrientation.lockAsync(ScreenOrientation.Orientation.PORTRAIT_UP);
}

export default class App extends Component {
  state = {
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
  };

  render() {
    if (!this.state.preLoaded) {
      return (
        <AppLoading
          startAsync={preloadAssetsAsync}
          onFinish={this.onFinish}
          onError={console.warn}
        />
      );
    }

    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <React.Fragment>
            <RootNavigator uriPrefix={prefix} />
            <DropdownAlert />
          </React.Fragment>
        </Provider>
      </ApolloProvider>
    );
  }
}
