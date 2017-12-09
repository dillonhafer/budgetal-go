import React from 'react';
import { StackNavigator } from 'react-navigation';

import MainScreen from 'screens/Main';
import SignInScreen from 'screens/SignIn';

const RootNavigator = StackNavigator({
  Main: { screen: MainScreen },
  SignIn: { screen: SignInScreen },
});

export default RootNavigator;
