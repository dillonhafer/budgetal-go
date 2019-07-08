import React, { PureComponent } from "react";
import {
  StyleSheet,
  Alert,
  Text,
  StatusBar,
  View,
  SectionList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { EndSessionRequest, AllSessionsRequest } from "@shared/api/sessions";
import { BlurViewInsetProps } from "@src/utils/navigation-helpers";
import { GetAuthenticationToken } from "@src/utils/authentication";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@shared/theme";
import moment from "moment";
import { orderBy } from "lodash";
import { humanUA } from "@shared/helpers";
import { notice, error } from "@src/notify";
import Spin from "@src/utils/Spin";
import Swipeout from "react-native-swipeout";

class SessionsScreen extends PureComponent {
  state = {
    loading: false,
    refreshing: false,
    sessions: {
      active: [],
      expired: [],
    },
    currentSession: "",
    scrollEnabled: true,
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
          ["orderKey"],
          ["desc"]
        );
        const expired = orderBy(
          resp.sessions.expired.map(s => {
            return {
              ...s,
              orderKey: moment(s.createdAt).unix(),
            };
          }),
          ["orderKey"],
          ["desc"]
        );
        this.setState({ sessions: { active, expired } });
      }
    } catch (err) {
      error("Error downloading session information");
    } finally {
      this.setState({ loading: false });
    }
  };

  confirmEndSession = session => {
    Alert.alert(
      "End Session?",
      `Are you sure you want to end this session?\n\n This will sign out the device using it. And you will need to sign in again on that device.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "End Session",
          style: "destructive",
          onPress: () => {
            this.endSession(session);
          },
        },
      ],
      { cancelable: true }
    );
  };

  endSession = async session => {
    const resp = await EndSessionRequest(session.authenticationKey);
    if (resp && resp.ok) {
      notice("Session Signed Out");
      const { active, expired } = this.state.sessions;
      const activeIndex = active.findIndex(
        s => s.authenticationKey === session.authenticationKey
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

  sessionButtons = session => {
    return [
      {
        component: (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <MaterialCommunityIcons name="delete" color={"#fff"} size={20} />
          </View>
        ),
        backgroundColor: colors.error,
        underlayColor: colors.error + "70",
        onPress: () => this.confirmEndSession(session),
      },
    ];
  };

  renderItem = ({ item: session }) => {
    const isCurrent = session.authenticationToken === this.state.currentSession;

    return (
      <Swipeout
        autoClose={true}
        backgroundColor={colors.error}
        disabled={isCurrent}
        right={this.sessionButtons(session)}
        scroll={scrollEnabled => {
          this.setState({ scrollEnabled });
        }}
      >
        <View style={[styles.listItem, session.style]}>
          <View
            style={[
              {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <View style={{ width: "14%", alignItems: "center" }}>
              {this.browser(session.userAgent)}
            </View>
            <View style={{ width: "86%" }}>
              <Text style={styles.listItemText}>
                {humanUA(session.userAgent)}
                {session.deviceName ? ` - ${session.deviceName}` : ""}{" "}
              </Text>
              <Text>{moment(session.createdAt).fromNow()}</Text>
              {isCurrent && (
                <Text style={{ color: colors.error }}>(current session)</Text>
              )}
            </View>
          </View>
        </View>
      </Swipeout>
    );
  };

  browser(ua) {
    const hua = humanUA(ua);
    let icon = "earth";
    let color = colors.primary;

    if (/chrome/i.test(hua)) {
      icon = "google-chrome";
      color = "#f4c20f";
    }

    if (/explorer/i.test(hua)) {
      icon = "internet-explorer";
    }

    if (/ie/i.test(hua)) {
      icon = "internet-explorer";
    }

    if (/edge/i.test(hua)) {
      icon = "edge";
    }

    if (/safari/i.test(hua)) {
      icon = "apple-safari";
    }

    if (/firefox/i.test(hua)) {
      icon = "firefox";
      color = "#E55B0A";
    }

    if (/on iOS/i.test(hua)) {
      icon = "apple";
      color = "#333";
    }

    if (/on Android/i.test(hua)) {
      icon = "android";
      color = "#76c258";
    }

    if (/opera/i.test(hua)) {
      icon = "opera";
      color = "#ff1b2e";
    }

    return <MaterialCommunityIcons name={icon} size={28} color={color} />;
  }

  renderExpiredItem = ({ index, section, item: session }) => {
    const lastStyle = section.data.length === index + 1 ? styles.last : {};
    return (
      <View style={[styles.listItem, styles.expiredListItem, lastStyle]}>
        <View style={{ width: "14%", alignItems: "center" }}>
          {this.browser(session.userAgent)}
        </View>
        <View
          style={{ flexDirection: "row", width: "86%", alignItems: "center" }}
        >
          <TouchableOpacity onPress={this.toggleDelete}>
            <Text style={styles.listItemText}>
              {humanUA(session.userAgent)}
              {session.deviceName ? ` - ${session.deviceName}` : ""}
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
      error("There was a problem refreshing the session data");
    } finally {
      this.setState({ refreshing: false });
    }
  };

  render() {
    const { loading, refreshing } = this.state;
    const { active, expired } = this.state.sessions;
    const sessions = [
      {
        title: "Active Sessions",
        renderItem: this.renderItem,
        data: active,
      },
      {
        title: "Expired Sessions (last 10)",
        renderItem: this.renderExpiredItem,
        data: expired,
      },
    ];

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SectionList
          {...BlurViewInsetProps}
          style={styles.list}
          keyExtractor={s => s.authenticationToken}
          sections={sessions}
          refreshControl={
            <RefreshControl
              tintColor={"lightskyblue"}
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }
          scrollEnabled={this.state.scrollEnabled}
          ItemSeparatorComponent={this.renderSeparator}
          renderSectionHeader={this.renderSectionHeader}
          renderItem={this.renderItem}
        />
        <Spin spinning={loading && !refreshing} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
  },
  header: {
    borderWidth: 0.5,
    borderColor: "#AAA",
    backgroundColor: "#f7f7f7",
    borderLeftColor: "#f7f7f7",
    borderRightColor: "#f7f7f7",
    padding: 5,
  },
  headerText: {
    color: "#AAA",
  },
  list: {
    width: "100%",
    backgroundColor: "transparent",
  },
  listSeparatorContainer: {
    backgroundColor: "#fff",
  },
  listSeparator: {
    height: 1,
    width: "86%",
    backgroundColor: "#CED0CE",
    marginLeft: "14%",
  },
  listItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
  },
  expiredListItem: {
    height: 50,
  },
  listItemText: {
    fontSize: 14,
    textAlign: "left",
    color: "#444",
  },
  last: {
    borderWidth: 1,
    borderColor: "#fff",
    borderBottomColor: colors.lines,
  },
});

export default SessionsScreen;
