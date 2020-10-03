import DropdownAlert from "@src/components/DropDownAlert";
import RootNavigator from "@src/navigators/root";
import { createApolloClient } from "@src/utils/apollo";
import Device from "@src/utils/Device";
import { preloadAssetsAsync } from "@src/utils/preload-assets";
import { AppLoading, Linking } from "expo";
import React, { useState } from "react";
import { ApolloProvider } from "react-apollo";
import { Platform, StatusBar } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";

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
