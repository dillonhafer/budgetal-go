import React, { PureComponent } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';

// Redux
import { connect } from 'react-redux';

// API
import { SignOutRequest } from 'api/sessions';
import { RemoveAuthentication } from 'utils/authentication';

// Navigation
import { navigateRoot } from 'navigators';

// Components
import colors from 'utils/colors';
import { error } from 'notify';
import { PrimaryButton, DangerButton } from 'forms';
import { WebBrowser } from 'expo';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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
    this.props.navigation.navigate('AccountEdit', { user: this.props.user });
  };

  navChangePassword = () => {
    this.props.navigation.navigate('ChangePassword');
  };

  navSessions = () => {
    this.props.navigation.navigate('Sessions');
  };

  navLegal = () => {
    this.props.navigation.navigate('Legal');
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

  renderButton = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.listItem, item.style]}
        onPress={item.onPress}
      >
        <View
          style={{ flexDirection: 'row', width: '86%', alignItems: 'center' }}
        >
          <View style={styles.listItemIcon}>
            <MaterialCommunityIcons
              name={item.icon.name}
              size={28}
              color={item.icon.color}
            />
          </View>
          <Text style={styles.listItemText}>{item.label}</Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          style={{ paddingRight: 10 }}
          color={'#ced0ce'}
        />
      </TouchableOpacity>
    );
  };

  render() {
    const { loading } = this.state;
    const { user } = this.props;
    const buttons = [
      {
        key: 'sessions',
        label: 'Sessions',
        icon: { name: 'folder-lock-open', color: colors.primary },
        onPress: this.navSessions,
        style: styles.first,
      },
      {
        key: 'password',
        label: 'Change Password',
        icon: { name: 'account-key', color: colors.primary },
        onPress: this.navChangePassword,
      },
      {
        key: 'privacy',
        label: 'Privacy',
        icon: { name: 'eye', color: '#aaa' },
        onPress: this.openPrivacyPage,
      },
      {
        key: 'help',
        label: 'Help',
        icon: { name: 'help-circle', color: '#aaa' },
        onPress: this.openHelpPage,
      },
      {
        key: 'legal',
        label: 'Legal',
        icon: { name: 'gavel', color: '#aaa' },
        onPress: this.navLegal,
        style: styles.last,
      },
    ];

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <FlatList
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
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={26}
                      color={'#ced0ce'}
                    />
                  </View>
                </TouchableOpacity>
                <View style={{ height: 50 }} />
              </View>
            );
          }}
          style={styles.list}
          data={buttons}
          ItemSeparatorComponent={this.renderSeparator}
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
    width: '10%',
    margin: '3%',
    marginLeft: '3%',
    marginRight: '3%',
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
});

export default connect(
  state => ({
    user: state.users,
  }),
  dispatch => ({}),
)(AccountScreen);
