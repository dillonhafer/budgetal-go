import DropdownAlert from "@src/components/DropDownAlert";
import RootNavigator from "@src/navigators/root";
import { createApolloClient } from "@src/utils/apollo";
import Device from "@src/utils/Device";
import { preloadAssetsAsync } from "@src/utils/preload-assets";
import registerForPushNotifications from "@src/utils/registerForPushNotifications";
import { AppLoading, Linking, ScreenOrientation } from "expo";
import React, { useEffect, useState } from "react";
import { ApolloProvider } from "react-apollo";
import { Platform, StatusBar } from "react-native";

StatusBar.setBarStyle("light-content", true);
const client = createApolloClient();
const prefix = Linking.makeUrl("/");

// Allow iPads to use landscape
if (Platform.OS === "ios" && Device.isTablet()) {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.ALL);
} else {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
}

const App = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  if (!loaded) {
    return (
      <AppLoading
        startAsync={preloadAssetsAsync}
        onFinish={() => setLoaded(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <ApolloProvider client={client}>
      <RootNavigator uriPrefix={prefix} />
      <DropdownAlert />
    </ApolloProvider>
  );
};

export default App;
