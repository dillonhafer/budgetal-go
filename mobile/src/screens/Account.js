import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

// API
import { SignOutRequest } from 'api/sessions';
import { RemoveAuthentication, GetCurrentUser } from 'utils/authentication';

// Navigation
import { navigateRoot } from 'navigators';

// Components
import colors from 'utils/colors';
import { error } from 'notify';
import { PrimaryButton, DangerButton } from 'forms';
import { WebBrowser } from 'expo';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

class AccountScreen extends Component {
  state = {
    loading: false,
    user: {
      firstName: '',
      lastName: '',
      email: '',
      avatarUrl: '',
    },
  };

  static navigationOptions = {
    title: 'Account Settings',
    headerBackTitle: 'Settings',
    tabBarLabel: 'Account',
    tabBarIcon: ({ tintColor }) => (
      <Ionicons name="md-person" size={32} color={tintColor} />
    ),
  };

  componentDidMount() {
    this.loadUser();
  }

  loadUser = async () => {
    try {
      const user = await GetCurrentUser();
      this.setState({ user });
    } catch (err) {
      //
    }
  };

  signOut = async () => {
    try {
      await SignOutRequest();
      await RemoveAuthentication();
      navigateRoot(this.props.screenProps.parentNavigation.dispatch);
    } catch (err) {}
  };

  openPrivacyPage = async () => {
    await WebBrowser.openBrowserAsync('https://www.budgetal.com/privacy');
  };

  openHelpPage = async () => {
    await WebBrowser.openBrowserAsync(
      'https://docs.google.com/forms/d/e/1FAIpQLSd-r56BTzaLCSeEUIhNeA_cGaGB7yssQByQnBIScFKuMxwhNA/viewform',
    );
  };

  editAccount = () => {
    this.props.navigation.navigate('AccountEdit');
  };

  confirmSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: this.signOut,
        },
      ],
      { cancelable: true },
    );
  };

  render() {
    const { loading, user } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar barStyle="dark-content" />
        <TouchableOpacity
          style={styles.profileContainer}
          onPress={this.editAccount}
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri: 'http://10.0.0.2:3001' + user.avatarUrl }}
            />
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>
              {[user.firstName, user.lastName].join(' ')}
            </Text>
            <Text style={styles.emailText}>{user.email}</Text>
          </View>
          <View style={{ paddingRight: 15 }}>
            <MaterialCommunityIcons
              name="chevron-right"
              size={32}
              color={colors.primary}
            />
          </View>
        </TouchableOpacity>

        <PrimaryButton title="Privacy" onPress={this.openPrivacyPage} />
        <PrimaryButton title="Help" onPress={this.openHelpPage} />

        <View style={{ height: 50 }} />

        <DangerButton
          title="Sign Out"
          onPress={this.confirmSignOut}
          loading={loading}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececec',
    alignItems: 'center',
    flexDirection: 'column',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: 'white',
    alignSelf: 'stretch',
    borderWidth: 0.5,
    borderColor: '#aaa',
    borderLeftColor: '#fff',
    borderRightColor: '#fff',
  },
  imageContainer: {
    paddingLeft: 25,
  },
  image: {
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: '#aaa',
    borderRadius: 35,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#444',
  },
  emailText: {
    color: '#888',
  },
});

export default AccountScreen;
