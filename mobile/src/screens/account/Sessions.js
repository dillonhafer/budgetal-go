import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Alert,
  Text,
  StatusBar,
  View,
  SectionList,
  TouchableOpacity,
  LayoutAnimation,
  RefreshControl,
} from 'react-native';

// Redux
import { connect } from 'react-redux';
import { toggleDelete } from 'actions/sessions';

// API
import { EndSessionRequest, AllSessionsRequest } from 'api/sessions';

// Components
import { GetAuthenticationToken } from 'utils/authentication';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from 'utils/colors';
import moment from 'moment';
import { orderBy } from 'lodash';
import { humanUA } from 'utils/helpers';
import { notice } from 'notify';

const RightEditButton = connect(
  state => ({
    isEditing: state.sessions.showDelete,
  }),
  dispatch => ({
    onPress: () => {
      LayoutAnimation.easeInEaseOut();
      dispatch(toggleDelete());
    },
  }),
)(({ isEditing, onPress }) => {
  return (
    <TouchableOpacity style={{}} onPress={onPress}>
      <Text
        style={{
          color: '#037aff',
          minWidth: 73,
          textAlign: 'right',
          fontSize: 17,
          paddingLeft: 10,
          paddingRight: 10,
          fontWeight: isEditing ? '700' : '500',
        }}
      >
        {isEditing ? 'Cancel' : 'Edit'}
      </Text>
    </TouchableOpacity>
  );
});

class SessionsScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: 'Sessions',
    headerRight: <RightEditButton />,
  });

  state = {
    loading: false,
    refreshing: false,
    sessions: {
      active: [],
      expired: [],
    },
    currentSession: '',
  };

  componentDidMount = () => {
    this.loadCurrentSession();
    this.fetchSessions();
  };

  loadCurrentSession = async () => {
    const currentSession = await GetAuthenticationToken();
    this.setState({ currentSession });
  };

  fetchSessions = async () => {
    this.setState({ loading: true });
    try {
      const resp = await AllSessionsRequest();
      if (resp && resp.ok) {
        const active = orderBy(
          resp.sessions.active.map(s => {
            return {
              ...s,
              orderKey: moment(s.createdAt).unix(),
            };
          }),
          ['orderKey'],
          ['desc'],
        );
        const expired = orderBy(
          resp.sessions.expired.map(s => {
            return {
              ...s,
              orderKey: moment(s.createdAt).unix(),
            };
          }),
          ['orderKey'],
          ['desc'],
        );
        this.setState({ sessions: { active, expired } });
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  confirmEndSession = session => {
    Alert.alert(
      'End Session?',
      `Are you sure you want to end this session?\n\n This will sign out the device using it. And you will need to sign in again on that device.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: () => {
            this.endSession(session);
          },
        },
      ],
      { cancelable: true },
    );
  };

  endSession = async session => {
    const resp = await EndSessionRequest(session.authenticationKey);
    if (resp && resp.ok) {
      notice('Session Signed Out');
      const { active, expired } = this.state.sessions;
      const activeIndex = active.findIndex(
        s => s.authenticationKey === session.authenticationKey,
      );

      this.setState({
        sessions: {
          active: [
            ...active.slice(0, activeIndex),
            ...active.slice(activeIndex + 1),
          ],
          expired: [...expired, { ...session, expiredAt: moment() }],
        },
      });
    }
  };

  renderSectionHeader = ({ section }) => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{section.title}</Text>
      </View>
    );
  };

  renderSeparator = () => {
    return (
      <View style={styles.listSeparatorContainer}>
        <View style={styles.listSeparator} />
      </View>
    );
  };

  renderItem = ({ item: session }) => {
    const isCurrent = session.authenticationToken === this.state.currentSession;

    const deleteStyles =
      this.props.showDelete && !isCurrent
        ? { left: 35, marginRight: 25 }
        : { width: 0, left: -50 };

    return (
      <View style={[styles.listItem, session.style]}>
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <View style={[deleteStyles]}>
            <TouchableOpacity
              onPress={_ => {
                this.confirmEndSession(session);
              }}
            >
              <MaterialCommunityIcons
                name={'minus-circle'}
                size={22}
                color={colors.error}
              />
            </TouchableOpacity>
          </View>
          <View style={{ width: '14%', alignItems: 'center' }}>
            {this.browser(session.userAgent)}
          </View>
          <View style={{ width: '86%' }}>
            <Text style={styles.listItemText}>
              {humanUA(session.userAgent)}{' '}
              <Text style={{ color: colors.error }}>
                {isCurrent ? '(current session)' : ''}
              </Text>
            </Text>
            <Text>{moment(session.createdAt).fromNow()}</Text>
          </View>
        </View>
      </View>
    );
  };

  browser(ua) {
    const hua = humanUA(ua);
    let icon = 'earth';
    let color = colors.primary;

    if (/chrome/i.test(hua)) {
      icon = 'google-chrome';
      color = '#f4c20f';
    }

    if (/explorer/i.test(hua)) {
      icon = 'internet-explorer';
    }

    if (/safari/i.test(hua)) {
      icon = 'apple-safari';
    }

    if (/on iOS/i.test(hua)) {
      icon = 'apple';
      color = '#333';
    }

    if (/on Android/i.test(hua)) {
      icon = 'android';
      color = '#76c258';
    }

    return <MaterialCommunityIcons name={icon} size={28} color={color} />;
  }

  renderExpiredItem = ({ index, section, item: session }, p) => {
    const lastStyle = section.data.length === index + 1 ? styles.last : {};
    return (
      <View style={[styles.listItem, styles.expiredListItem, lastStyle]}>
        <View style={{ width: '14%', alignItems: 'center' }}>
          {this.browser(session.userAgent)}
        </View>
        <View
          style={{ flexDirection: 'row', width: '86%', alignItems: 'center' }}
        >
          <TouchableOpacity onPress={this.toggleDelete}>
            <Text style={styles.listItemText}>
              {humanUA(session.userAgent)}
            </Text>
            <Text>{moment(session.createdAt).fromNow()}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  onRefresh = async () => {
    this.setState({ refreshing: true });
    try {
      await this.fetchSessions();
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ refreshing: false });
    }
  };

  render() {
    const { active, expired } = this.state.sessions;
    const sessions = [
      {
        title: 'Active Sessions',
        renderItem: this.renderItem,
        data: active,
      },
      {
        title: 'Expired Sessions (last 10)',
        renderItem: this.renderExpiredItem,
        data: expired,
      },
    ];

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SectionList
          style={styles.list}
          keyExtractor={s => s.authenticationToken}
          sections={sessions}
          refreshControl={
            <RefreshControl
              tintColor={'lightskyblue'}
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
          ItemSeparatorComponent={this.renderSeparator}
          renderSectionHeader={this.renderSectionHeader}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    flexDirection: 'column',
  },
  header: {
    borderWidth: 0.5,
    borderColor: '#AAA',
    backgroundColor: '#f7f7f7',
    borderLeftColor: '#f7f7f7',
    borderRightColor: '#f7f7f7',
    padding: 5,
  },
  headerText: {
    color: '#AAA',
  },
  list: {
    width: '100%',
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
    height: 50,
  },
  expiredListItem: {
    height: 50,
  },
  listItemText: {
    fontSize: 14,
    textAlign: 'left',
    color: '#444',
  },
  listItemIcon: { marginRight: 7 },
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
    ...state.sessions,
  }),
  dispatch => ({}),
)(SessionsScreen);
