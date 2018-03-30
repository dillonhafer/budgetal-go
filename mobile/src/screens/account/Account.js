import React, { PureComponent } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  View,
  Platform,
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
import { WebBrowser, Constants, Updates } from 'expo';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Device from 'utils/Device';
const isTablet = Device.isTablet();

class AccountScreen extends PureComponent {
  state = {
    isAvailable: false,
    loading: false,
    updateDownloading: false,
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

  componentDidMount() {
    this.checkForUpdate();
  }

  checkForUpdate = async () => {
    if (this.state.isAvailable) {
      try {
        this.setState({ updateDownloading: true });
        await Updates.fetchUpdateAsync();
        Updates.reload();
      } catch (e) {
        error('Could not download update');
      } finally {
        this.setState({ updateDownloading: false });
      }
      return;
    }

    try {
      const { isAvailable } = await Updates.checkForUpdateAsync();
      this.setState({ isAvailable });
    } catch (e) {
      //
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
    const iconStyles = item.icon.backgroundColor
      ? [styles.listItemIcon, { backgroundColor: item.icon.backgroundColor }]
      : styles.listItemIcon;

    return (
      <TouchableOpacity
        style={[styles.listItem, item.style, activeRowStyles]}
        onPress={onPress}
        disabled={activeSidebar || !item.onPress}
      >
        <View
          style={{
            flexDirection: 'row',
            width: '65%',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '22%',
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            <View style={iconStyles}>
              <MaterialCommunityIcons
                name={item.icon.name}
                size={22}
                color={'#fff'}
              />
            </View>
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
    const buildNumber = Platform.select({
      ios: Constants.manifest.ios.buildNumber,
      android: Constants.manifest.android.versionCode,
    });
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
          },
          {
            key: 'update',
            label: this.state.updateDownloading
              ? 'Downloading Update...'
              : this.state.isAvailable
                ? 'Download Update'
                : 'Check for updates',
            icon: {
              name: 'update',
              backgroundColor: this.state.updateDownloading
                ? colors.yellow
                : this.state.isAvailable ? colors.success : colors.primary,
            },
            onPress: this.state.updateDownloading ? null : this.checkForUpdate,
            style: styles.last,
            right: <View />,
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
              <Text style={styles.version} adjustsFontSizeToFit={true}>
                {Constants.manifest.version} ({buildNumber})
              </Text>
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
    marginLeft: 25,
    borderRadius: 35,
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: '#aaa',
    backgroundColor: '#aaa',
    overflow: 'hidden',
  },
  image: {
    width: 70,
    height: 70,
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
    backgroundColor: colors.primary,
    borderColor: 'transparent',
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
    width: '35%',
    textAlign: 'right',
    paddingRight: 15,
    color: '#ced0ce',
    fontSize: 16,
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
