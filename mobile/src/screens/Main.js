import React, { Component } from 'react';
import {
  TouchableOpacity,
  StatusBar,
  TextInput,
  StyleSheet,
  Text,
  Image,
  View,
  Button,
  KeyboardAvoidingView,
} from 'react-native';
import colors from 'utils/colors';
import { IsAuthenticated, GetCurrentUser } from 'utils/authentication';
import { navigateHome } from 'navigators';

// Redux
import { connect } from 'react-redux';
import { updateCurrentUser } from 'actions/users';

const LogoSeparator = ({ color }) => {
  const styles = StyleSheet.create({
    container: {
      marginTop: 70,
      flexDirection: 'row',
      alignSelf: 'stretch',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      alignSelf: 'center',
      height: 60,
      width: 60,
      borderWidth: 2,
      borderColor: '#fff',
      borderRadius: 13,
      marginBottom: 5,
    },
    line: {
      flex: 1,
      backgroundColor: '#fff',
      height: 0.5,
    },
    logoContainer: {
      margin: 15,
      flexDirection: 'column',
    },
    logoText: {
      textAlign: 'center',
      color: '#fff',
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
  };

  componentDidMount() {
    this.checkForUser();
  }

  checkForUser = async () => {
    try {
      const signedIn = await IsAuthenticated();
      if (signedIn) {
        const user = await GetCurrentUser();
        this.props.updateCurrentUser(user);
        this.setState({ checking: false });
        navigateHome(this.props.navigation.dispatch);
      } else {
        this.setState({ checking: false });
      }
    } catch (err) {
      this.setState({ checking: false });
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    if (this.state.checking) {
      return null;
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LogoSeparator />
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>Plan</Text>
          <Text style={styles.quoteText}>Don't Wonder</Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigate('SignIn')}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigate('Register')}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
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
  quoteContainer: {
    alignSelf: 'stretch',
    padding: 40,
    paddingBottom: 100,
  },
  quoteText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderTopColor: 'blue',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    alignSelf: 'stretch',
  },
  button: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.primary + '80',
    padding: 18,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  separator: {
    alignSelf: 'stretch',
    width: 0.5,
    backgroundColor: 'blue',
  },
});

export default connect(
  state => ({}),
  dispatch => ({
    updateCurrentUser: user => {
      dispatch(updateCurrentUser(user));
    },
  }),
)(MainScreen);
