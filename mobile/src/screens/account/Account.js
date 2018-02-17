import React, { PureComponent } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  View,
  SectionList,
} from 'react-native';

// Redux
import { connect } from 'react-redux';

// API
import { SignOutRequest } from 'api/sessions';
import { RemoveAuthentication } from 'utils/authentication';

// Navigation
import { navigateRoot } from 'navigators';

// Components
import { notice, error } from 'notify';
import colors from 'utils/colors';
import { DangerButton } from 'forms';
import { WebBrowser, Constants } from 'expo';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Device from 'utils/Device';
const isTablet = Device.isTablet();

class AccountScreen extends PureComponent {
  state = {
    loading: false,
  };

  static navigationOptions = {
    title: 'Account Settings',
    headerBackTitle: 'Settings',
    tabBarLabel: 'Account',
    tabBarIcon: ({ tintColor }) => (
      <Ionicons name="md-person" size={32} color={tintColor} />
    ),
  };

  signOut = async () => {
    try {
      await SignOutRequest();
      await RemoveAuthentication();
      navigateRoot(this.props.screenProps.parentNavigation.dispatch);
      notice('You are now signed out');
    } catch (err) {
      error('Something went wrong. Try closing the app.');
    }
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
    this.props.screenProps.layoutNavigate('AccountEdit', {
      user: this.props.user,
    });
  };

  navChangePassword = () => {
    this.props.screenProps.layoutNavigate('ChangePassword');
  };

  navSessions = () => {
    this.props.screenProps.layoutNavigate('Sessions');
  };

  navLegal = () => {
    this.props.screenProps.layoutNavigate('Legal');
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

  renderSeparator = () => {
    return (
      <View style={styles.listSeparatorContainer}>
        <View style={styles.listSeparator} />
      </View>
    );
  };

  renderHeader({ section }) {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{section.title}</Text>
      </View>
    );
  }

  renderButton = ({ item }) => {
    const defaultRight = isTablet ? null : (
      <Ionicons
        name="ios-arrow-forward"
        size={22}
        style={{ paddingRight: 15 }}
        color={'#ced0ce'}
      />
    );

    const { activeSidebarScreen } = this.props.screenProps;
    let activeRowStyles = {};
    let activeTextStyles = {};
    const activeSidebar = activeSidebarScreen === item.label.replace(' ', '');
    if (activeSidebar) {
      activeRowStyles = {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
      };
      activeTextStyles = { color: '#fff' };
    }

    const onPress = activeSidebar ? () => {} : item.onPress;

    return (
      <TouchableOpacity
        style={[styles.listItem, item.style, activeRowStyles]}
        onPress={onPress}
        disabled={activeSidebar || !item.onPress}
      >
        <View
          style={{ flexDirection: 'row', width: '86%', alignItems: 'center' }}
        >
          <View style={styles.listItemIcon}>
            <MaterialCommunityIcons
              name={item.icon.name}
              size={22}
              color={'#fff'}
            />
          </View>
          <Text style={[styles.listItemText, activeTextStyles]}>
            {item.label}
          </Text>
        </View>
        {item.right || defaultRight}
      </TouchableOpacity>
    );
  };

  render() {
    const { loading } = this.state;
    const { user } = this.props;
    const buttons = [
      {
        title: 'ACCOUNT',
        data: [
          {
            key: 'sessions',
            label: 'Sessions',
            icon: { name: 'folder-lock-open' },
            onPress: this.navSessions,
            style: styles.first,
          },
          {
            key: 'password',
            label: 'Change Password',
            icon: { name: 'account-key' },
            onPress: this.navChangePassword,
            style: styles.last,
          },
        ],
      },
      {
        title: 'SUPPORT',
        data: [
          {
            key: 'privacy',
            label: 'Privacy',
            icon: { name: 'eye' },
            onPress: this.openPrivacyPage,
            style: styles.first,
          },
          {
            key: 'help',
            label: 'Help',
            icon: { name: 'help-circle' },
            onPress: this.openHelpPage,
            style: styles.last,
          },
        ],
      },
      {
        title: 'ABOUT',
        data: [
          {
            key: 'legal',
            label: 'Legal',
            icon: { name: 'gavel' },
            onPress: this.navLegal,
            style: styles.first,
          },
          {
            key: 'version',
            label: 'Version',
            icon: { name: 'information' },
            style: styles.last,
            right: (
              <Text style={styles.version}>{Constants.manifest.version}</Text>
            ),
          },
        ],
      },
    ];

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SectionList
          ListHeaderComponent={() => {
            return (
              <View>
                <View style={{ height: 20 }} />
                <TouchableOpacity
                  style={styles.profileContainer}
                  onPress={this.editAccount}
                >
                  <View style={styles.imageContainer}>
                    <Image
                      style={styles.image}
                      source={{ uri: user.avatarUrl }}
                    />
                  </View>
                  <View style={styles.nameContainer}>
                    <Text style={styles.nameText}>
                      {[user.firstName, user.lastName].join(' ')}
                    </Text>
                    <Text style={styles.emailText}>{user.email}</Text>
                  </View>
                  <View style={{ paddingRight: 15 }}>
                    <Ionicons
                      name="ios-arrow-forward"
                      size={26}
                      color={'#ced0ce'}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          style={styles.list}
          stickySectionHeadersEnabled={false}
          sections={buttons}
          ItemSeparatorComponent={this.renderSeparator}
          renderSectionHeader={this.renderHeader}
          renderItem={this.renderButton}
          ListFooterComponent={() => {
            return (
              <View>
                <View style={{ height: 50 }} />
                <DangerButton
                  title="Sign Out"
                  onPress={this.confirmSignOut}
                  loading={loading}
                />
                <View style={{ height: 20 }} />
              </View>
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    backgroundColor: '#aaa',
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
  list: {
    backgroundColor: 'transparent',
  },
  listSeparatorContainer: {
    backgroundColor: '#fff',
  },
  listSeparator: {
    height: 1,
    width: '86%',
    backgroundColor: '#CED0CE',
    marginLeft: '14%',
  },
  listItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItemText: {
    fontSize: 17,
    textAlign: 'left',
    color: '#444',
  },
  listItemIcon: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    margin: '3%',
    marginLeft: '3%',
    marginRight: '3%',
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 6,
  },
  first: {
    borderWidth: 1,
    borderColor: '#fff',
    borderTopColor: colors.lines,
  },
  last: {
    borderWidth: 1,
    borderColor: '#fff',
    borderBottomColor: colors.lines,
  },
  version: {
    color: '#ced0ce',
    marginRight: 25,
    fontSize: 18,
  },
  headerText: {
    marginTop: 15,
    padding: 5,
    paddingLeft: 15,
    fontSize: 14,
    color: '#aaa',
    fontWeight: '600',
  },
});

export default connect(state => ({
  user: state.users,
}))(AccountScreen);
