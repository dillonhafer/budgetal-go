import { colors } from "@shared/theme";
import Monogram from "@src/components/Monogram";
import { Bold, Medium, Small } from "@src/components/Text";
import { notice } from "@src/notify";
import LegalModal from "@src/screens/Legal";
import { RemoveAuthentication } from "@src/utils/authentication";
import { WebBrowser } from "expo";
import Constants from "expo-constants";
import gql from "graphql-tag";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-apollo";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { DrawerItemsProps, SafeAreaView } from "react-navigation";
import DrawerItem from "./DrawerItem";
import { GetCurrentUser } from "./__generated__/GetCurrentUser";
import { SignOut } from "./__generated__/SignOut";

const SIGN_OUT = gql`
  mutation SignOut {
    signOut {
      id
    }
  }
`;

const CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      admin
      avatarUrl
      email
      firstName
      id
      lastName
    }
  }
`;

interface AccountProps {
  onPress(): void;
  active: boolean;
}

const AccountRow = ({ onPress, active }: AccountProps) => {
  const { data } = useQuery<GetCurrentUser>(CURRENT_USER);
  if (!data || !data.currentUser) {
    return null;
  }
  const user = data.currentUser;
  const backgroundColor = active ? colors.drawerActive : "transparent";
  const fullName = [user.firstName, user.lastName].join(" ").trim();
  const name = fullName.length > 0 ? fullName : "Hello!";

  return (
    <View style={{ backgroundColor }}>
      <TouchableOpacity style={styles.profileContainer} onPress={onPress}>
        <View style={styles.imageContainer}>
          <Monogram user={user} />
        </View>
        <View style={styles.nameContainer}>
          <Bold style={styles.nameText}>{name}</Bold>
          <Medium style={styles.emailText}>{user.email}</Medium>
        </View>
      </TouchableOpacity>
    </View>
  );
};
interface Props extends DrawerItemsProps {}

const DrawerContent = ({ navigation }: Props) => {
  const [visible, setVisible] = useState(false);
  const [signOut, { client }] = useMutation<SignOut>(SIGN_OUT);

  const signOutUser = () => {
    signOut()
      .then(RemoveAuthentication)
      .then(() => {
        if (client) client.resetStore();
        navigation.navigate("SignIn");
        setTimeout(() => notice("You are now signed out"), 1000);
      });
  };

  const confirmSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: signOutUser,
        },
      ],
      { cancelable: true }
    );
  };

  const currentRoute = [
    "budgets",
    "annual",
    "statistics",
    "networth",
    "account",
  ][navigation.state.index];

  return (
    <>
      <ScrollView>
        <SafeAreaView
          style={styles.container}
          forceInset={{ top: "always", horizontal: "never" }}
        >
          <View>
            <AccountRow
              active={currentRoute === "account"}
              onPress={() => {
                navigation.navigate("Account");
              }}
            />
          </View>
          <DrawerItem
            active={currentRoute === "budgets"}
            iconName="md-calculator"
            onPress={() => {
              navigation.navigate("Budget");
            }}
            label="BUDGETS"
          />
          <DrawerItem
            active={currentRoute === "annual"}
            iconName="md-calendar"
            onPress={() => {
              navigation.navigate("AnnualBudgets");
            }}
            label="ANNUAL BUDGETS"
          />
          <DrawerItem
            iconName="md-stats"
            active={currentRoute === "statistics"}
            onPress={() => {
              navigation.navigate("Statistics");
            }}
            label="STATISTICS"
          />
          <DrawerItem
            iconName="md-trending-up"
            active={currentRoute === "networth"}
            onPress={() => {
              navigation.navigate("NetWorth");
            }}
            label="NET WORTH"
          />
          <DrawerItem
            iconName="ios-eye-off"
            onPress={() => {
              WebBrowser.openBrowserAsync("https://www.budgetal.com/privacy");
            }}
            label="PRIVACY"
          />
          <DrawerItem
            iconName="ios-help-circle-outline"
            onPress={() => {
              WebBrowser.openBrowserAsync(
                "https://docs.google.com/forms/d/e/1FAIpQLSd-r56BTzaLCSeEUIhNeA_cGaGB7yssQByQnBIScFKuMxwhNA/viewform"
              );
            }}
            label="HELP"
          />
          <DrawerItem
            iconName="ios-power"
            onPress={confirmSignOut}
            label="SIGN OUT"
          />
          <View style={styles.footer}>
            <View>
              <Bold style={styles.versionText}>
                {`VERSION\n${Constants.nativeAppVersion} (${
                  Constants.manifest.ios.buildNumber
                })`}
              </Bold>

              <TouchableOpacity
                onPress={() => {
                  StatusBar.setBarStyle("dark-content", true);
                  setVisible(true);
                }}
              >
                <Small style={styles.legal}>LEGAL</Small>
              </TouchableOpacity>
              <LegalModal
                visible={visible}
                onClose={() => {
                  StatusBar.setBarStyle("light-content", true);
                  setVisible(false);
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: "100%",
  },
  versionText: {
    flex: 1,
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
  },
  legal: {
    flex: 1,
    color: "#fff",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  footer: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: "flex-end",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  imageContainer: {
    marginLeft: 20,
    borderRadius: 35,
    width: 50,
    height: 50,
    backgroundColor: "#aaa",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
    color: "#fff",
  },
  emailText: {
    color: "#fff",
  },
});

export default DrawerContent;
