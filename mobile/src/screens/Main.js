import React, { Component } from 'react';
import {
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  View,
  Platform,
} from 'react-native';
import colors from 'utils/colors';
import { IsAuthenticated, GetCurrentUser } from 'utils/authentication';
import { navigateHome } from 'navigators';

// Redux
import { connect } from 'react-redux';
import { updateCurrentUser } from 'actions/users';
import { LinearGradient } from 'expo';

const LogoSeparator = () => {
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
    const { checking } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: colors.primary }}>
        <View style={[styles.container, { opacity: checking ? 0 : 1 }]}>
          <StatusBar barStyle="light-content" />
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.4)']}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          />
          <LogoSeparator />
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteText}>Budgetal | ˈbəjətal</Text>
            <Text
              style={[
                styles.quoteText,
                {
                  fontSize: 14,
                  fontFamily:
                    Platform.OS === 'ios' ? 'HelveticaNeue-LightItalic' : '',
                },
              ]}
            >
              • pertaining to a plan
            </Text>
          </View>
          <SafeAreaView style={styles.buttonRow}>
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
          </SafeAreaView>
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
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : '',
  },
  buttonRow: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderTopColor: '#fff',
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
    backgroundColor: '#fff',
  },
});

export default connect(null, dispatch => ({
  updateCurrentUser: user => {
    dispatch(updateCurrentUser(user));
  },
}))(MainScreen);
