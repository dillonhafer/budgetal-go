import React, { Component } from 'react';
import {
  TouchableOpacity,
  Keyboard,
  StatusBar,
  StyleSheet,
  LayoutAnimation,
  Text,
  Image,
  View,
} from 'react-native';
import colors from 'utils/colors';
import { IsAuthenticated, GetCurrentUser } from 'utils/authentication';
import { navigateHome } from 'navigators';
import { Bold } from 'components/Text';
import Device from 'utils/Device';

// Redux
import { connect } from 'react-redux';
import { updateCurrentUser } from 'actions/users';

import SignIn from './SignIn';

const isTablet = Device.isTablet();

const LogoSeparator = ({ keyboardVisible }) => {
  const styles = StyleSheet.create({
    container: {
      height: keyboardVisible ? 0 : null,
      marginTop: keyboardVisible ? 40 : 70,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      alignSelf: 'center',
      height: keyboardVisible ? 0 : 60,
      width: keyboardVisible ? 0 : 60,
      borderWidth: 2,
      borderColor: '#fff',
      borderRadius: 13,
      marginBottom: 5,
    },
    line: {
      flex: 1,
      backgroundColor: '#fff',
      height: 1,
    },
    logoContainer: {
      margin: 15,
      flexDirection: 'column',
    },
    logoText: {
      textAlign: 'center',
      color: '#fff',
      backgroundColor: 'transparent',
      fontFamily: 'Montserrat-Light',
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('images/app_logo.png')} />
        <Text style={styles.logoText}>Budgetal</Text>
      </View>
      <View style={styles.line} />
    </View>
  );
};

class MainScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    checking: true,
    keyboardVisible: false,
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    if (isTablet) {
      return;
    }
    LayoutAnimation.easeInEaseOut();
    this.setState({ keyboardVisible: true });
  };

  _keyboardDidHide = () => {
    if (isTablet) {
      return;
    }
    LayoutAnimation.easeInEaseOut();
    this.setState({ keyboardVisible: false });
  };

  componentDidMount() {
    this.checkForUser();
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  checkForUser = async () => {
    let foundUser = false;
    try {
      foundUser = await IsAuthenticated();
      if (foundUser) {
        const user = await GetCurrentUser();
        this.props.updateCurrentUser(user);
        navigateHome(this.props.navigation.dispatch);
      }
    } finally {
      if (!foundUser) {
        this.setState({ checking: false });
      }
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    const { keyboardVisible, checking } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: colors.primary }}>
        <View style={[styles.container, { opacity: checking ? 0 : 1 }]}>
          <StatusBar barStyle="light-content" />
          <LogoSeparator keyboardVisible={keyboardVisible} />
          <SignIn navigation={this.props.navigation} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigate('Register')}
            >
              <Bold style={styles.registerButtonText}>
                I DON'T HAVE AN ACCOUNT
              </Bold>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    padding: 18,
  },
  registerButtonText: {
    fontSize: 11,
    color: colors.primary,
    textAlign: 'center',
  },
});

export default connect(
  null,
  dispatch => ({
    updateCurrentUser: user => {
      dispatch(updateCurrentUser(user));
    },
  }),
)(MainScreen);
