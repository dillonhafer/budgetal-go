import React, { PureComponent } from 'react';
import {
  Image,
  Alert,
  TouchableOpacity,
  StatusBar,
  View,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { DrawerItems, SafeAreaView } from 'react-navigation';
import LegalModal from 'screens/legal/LegalModal';
import { WebBrowser } from 'expo';
import Constants from 'expo-constants';
import { connect } from 'react-redux';
import DrawerItem from './DrawerItem';

// Sign out helpers
import { SignOutRequest } from '@shared/api/sessions';
// import { navigateRoot } from 'navigators';
import { notice, error } from 'notify';
import { RemoveAuthentication } from 'utils/authentication';

import { Small, Bold, Medium } from 'components/Text';

class LHC extends PureComponent {
  render() {
    const accountIsActive = this.props.navigation.state.index === 3;
    const backgroundColor = accountIsActive ? '#2eb1fc' : null;
    const { user } = this.props;
    return (
      <View style={{ backgroundColor }}>
        <TouchableOpacity
          style={styles.profileContainer}
          onPress={() => {
            StatusBar.setBarStyle('default', true);
            this.props.navigation.navigate('Account');
          }}
        >
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: user.avatarUrl }} />
          </View>
          <View style={styles.nameContainer}>
            <Bold style={styles.nameText}>
              {[user.firstName, user.lastName].join(' ')}
            </Bold>
            <Medium style={styles.emailText}>{user.email}</Medium>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const ListHeaderComponent = connect(state => ({
  user: state.users,
}))(LHC);

class DrawerContent extends PureComponent {
  state = {
    legalModalVisible: false,
  };

  onPressPrivacy = async () => {
    await WebBrowser.openBrowserAsync('https://www.budgetal.com/privacy');
  };

  onPressHelp = async () => {
    await WebBrowser.openBrowserAsync(
      'https://docs.google.com/forms/d/e/1FAIpQLSd-r56BTzaLCSeEUIhNeA_cGaGB7yssQByQnBIScFKuMxwhNA/viewform',
    );
  };

  signOut = async () => {
    try {
      await SignOutRequest();
      await RemoveAuthentication();
      // navigateRoot(this.props.navigation.dispatch);
      notice('You are now signed out');
      StatusBar.setBarStyle('default', true);
    } catch (err) {
      error('Something went wrong. Try closing the app.');
    }
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
    const excludedItems = ['Account'];
    const drawerItems = this.props.items.filter(
      i => !excludedItems.includes(i.key),
    );

    return (
      <ScrollView>
        <SafeAreaView
          style={styles.container}
          forceInset={{ top: 'always', horizontal: 'never' }}
        >
          <View>
            <ListHeaderComponent navigation={this.props.navigation} />
          </View>
          <View>
            <DrawerItems {...this.props} items={drawerItems} />
          </View>
          <DrawerItem
            iconName="ios-eye-off"
            onPress={this.onPressPrivacy}
            label="PRIVACY"
          />
          <DrawerItem
            iconName="ios-help-circle-outline"
            onPress={this.onPressHelp}
            label="HELP"
          />
          <DrawerItem
            iconName="ios-power"
            onPress={this.confirmSignOut}
            label="SIGN OUT"
          />
          <View style={styles.footer}>
            <View>
              <Bold style={styles.versionText}>
                {`VERSION\n${Constants.nativeAppVersion} (${
                  Constants.nativeBuildVersion
                })`}
              </Bold>

              <TouchableOpacity
                onPress={() => {
                  StatusBar.setBarStyle('dark-content', true);
                  this.setState({ legalModalVisible: true });
                }}
              >
                <Small style={styles.legal}>LEGAL</Small>
              </TouchableOpacity>
              <LegalModal
                visible={this.state.legalModalVisible}
                onClose={() => {
                  StatusBar.setBarStyle('light-content', true);
                  this.setState({ legalModalVisible: false });
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
  },
  versionText: {
    flex: 1,
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
  },
  legal: {
    flex: 1,
    color: '#fff',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  footer: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: 'flex-end',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  imageContainer: {
    marginLeft: 25,
    borderRadius: 35,
    width: 50,
    height: 50,
    backgroundColor: '#aaa',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  nameContainer: {
    paddingHorizontal: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  nameText: {
    fontSize: 18,
    color: '#fff',
  },
  emailText: {
    color: '#fff',
  },
});

export default DrawerContent;
