import React, { Component } from "react";
import {
  StatusBar,
  TextInput,
  View,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Image,
  Text,
} from "react-native";

// API
import Constants from "expo-constants";
import { SignInRequest } from "@shared/api/sessions";
import {
  SetAuthenticationToken,
  SetCurrentUser,
} from "@src/utils/authentication";

// Helpers
import { error, notice } from "@src/notify";
// import { navigateHome } from 'navigators';

// Components
import { Bold } from "@src/components/Text";
import { PrimarySquareButton } from "@src/forms";
import { colors } from "@shared/theme";
import { validEmail } from "@shared/helpers";
import { FormCard, SplitBackground } from "@src/components/Card";
import { Label } from "@src/components/Text";
import Device from "@src/utils/Device";
const deviceName = Constants.deviceName;
const isTablet = Device.isTablet();

const LogoSeparator = ({ keyboardVisible }) => {
  const styles = StyleSheet.create({
    container: {
      height: keyboardVisible ? 0 : null,
      marginTop: keyboardVisible ? 40 : 70,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    logo: {
      alignSelf: "center",
      height: keyboardVisible ? 0 : 60,
      width: keyboardVisible ? 0 : 60,
      borderWidth: 2,
      borderColor: "#fff",
      borderRadius: 13,
      marginBottom: 5,
    },
    line: {
      flex: 1,
      backgroundColor: "#fff",
      height: 1,
    },
    logoContainer: {
      margin: 15,
      flexDirection: "column",
    },
    logoText: {
      textAlign: "center",
      color: "#fff",
      backgroundColor: "transparent",
      fontFamily: "Lato-Light",
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("@src/assets/images/app_logo.png")}
        />
        <Text style={styles.logoText}>Budgetal</Text>
      </View>
      <View style={styles.line} />
    </View>
  );
};

class SignInScreen extends Component {
  static navigationOptions = {
    headerBackTitle: null,
  };

  inputs = [];

  state = {
    email: "",
    password: "",
    loading: false,
    keyboardVisible: false,
  };

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
  }

  _keyboardDidShow = () => {
    if (isTablet) {
      return;
    }
    LayoutAnimation.easeInEaseOut();
    this.setState({ keyboardVisible: true });
  };

  _keyboardDidHide = () => {
    if (isTablet) {
      return;
    }
    LayoutAnimation.easeInEaseOut();
    this.setState({ keyboardVisible: false });
  };

  validateFields = () => {
    const { email, password } = this.state;
    return email.length > 0 && validEmail(email) && password.length > 0;
  };

  signIn = async () => {
    const { email, password } = this.state;
    const resp = await SignInRequest({ email, password, deviceName });
    if (resp && resp.ok) {
      SetAuthenticationToken(resp.token);
      this.props.updateCurrentUser(resp.user);
      SetCurrentUser(resp.user);
      this.props.navigation.navigate("App");
      // navigateHome(this.props.navigation.dispatch);
      notice("You are now signed in!");
    } else {
      this.setState({ loading: false });
    }
  };

  handleOnPress = async () => {
    const valid = this.validateFields();
    if (!valid || this.state.loading) return;

    this.setState({ loading: true });
    try {
      if (valid) {
        await this.signIn();
      } else {
        error("Email/Password are invalid");
      }
    } catch (err) {
      this.setState({ loading: false });
    }
  };

  focusEmail = () => {
    this.inputs["email"].focus();
  };

  focusPassword = () => {
    this.inputs["password"].focus();
  };

  navForgotPassword = () => {
    this.props.navigation.navigate("ForgotPassword");
  };

  render() {
    const { navigate } = this.props.navigation;
    const { keyboardVisible, checking } = this.state;
    const { loading } = this.state;
    const valid = this.validateFields();
    return (
      <View style={{ flex: 1, backgroundColor: colors.primary }}>
        <View style={[styles.container, { opacity: checking ? 0 : 1 }]}>
          <StatusBar barStyle="light-content" />
          <LogoSeparator keyboardVisible={keyboardVisible} />
          <SplitBackground top={colors.primary} bottom={"#fff"}>
            <View style={{ alignItems: "center" }}>
              <View style={{ width: "100%", maxWidth: 350 }}>
                <FormCard>
                  <View style={{ marginTop: 10 }}>
                    <Label style={styles.label}>EMAIL</Label>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TextInput
                        keyboardType="email-address"
                        style={styles.input}
                        autoCapitalize={"none"}
                        inputAccessoryViewID={"email"}
                        underlineColorAndroid={"transparent"}
                        autoCorrect={false}
                        ref={input => {
                          this.inputs["email"] = input;
                        }}
                        onSubmitEditing={this.focusPassword}
                        returnKeyType="next"
                        enablesReturnKeyAutomatically={true}
                        onChangeText={email => this.setState({ email })}
                      />
                    </View>
                    <Label style={styles.label}>PASSWORD</Label>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TextInput
                        style={styles.input}
                        enablesReturnKeyAutomatically={true}
                        secureTextEntry={true}
                        autoCapitalize={"none"}
                        inputAccessoryViewID={"password"}
                        underlineColorAndroid={"transparent"}
                        ref={input => {
                          this.inputs["password"] = input;
                        }}
                        returnKeyType="done"
                        onSubmitEditing={this.handleOnPress}
                        onChangeText={password => this.setState({ password })}
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.forgotPasswordButton}
                      onPress={this.navForgotPassword}
                    >
                      <Label style={styles.forgotPasswordText}>
                        FORGOT PASSWORD
                      </Label>
                    </TouchableOpacity>
                  </View>
                </FormCard>
                <PrimarySquareButton
                  onPress={this.handleOnPress}
                  loading={!valid || loading}
                  title="sign in"
                />
              </View>
            </View>
          </SplitBackground>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigate("Register")}
            >
              <Bold style={styles.registerButtonText}>
                I DON'T HAVE AN ACCOUNT
              </Bold>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  forgotPasswordButton: {
    padding: 3,
  },
  forgotPasswordText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: "700",
    textAlign: "right",
  },
  input: {
    flex: 1,
    marginBottom: 10,
    borderRadius: 3,
    height: 40,
    backgroundColor: "#eee",
    paddingLeft: 10,
  },
  label: {
    color: "#aaa",
    fontWeight: "bold",
    fontSize: 11,
    padding: 5,
  },
  container: {
    backgroundColor: colors.primary,
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  button: {
    padding: 18,
  },
  registerButtonText: {
    fontSize: 11,
    color: colors.primary,
    textAlign: "center",
  },
});

export default SignInScreen;
