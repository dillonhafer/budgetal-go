import React, { useState, useRef } from "react";
import { TextInput, StatusBar, KeyboardAvoidingView } from "react-native";

// Redux
import { connect } from "react-redux";
import { updateCurrentUser } from "@src/actions/users";

// API
import { RegisterRequest } from "@shared/api/users";
import {
  SetAuthenticationToken,
  SetCurrentUser,
} from "@src/utils/authentication";

// Helpers
import { notice } from "@src/notify";
import { FormTitle } from "@src/typography";

// Components
import { PrimaryButton, FieldContainer, focus } from "@src/forms";
import { validEmail } from "@shared/helpers";
import styled from "styled-components/native";
import { NavigationScreenConfigProps } from "react-navigation";
import { colors } from "@shared/theme";

const Container = styled(KeyboardAvoidingView).attrs({
  behvaior: "padding",
  keyboardVerticalOffset: 60,
})({
  flex: 1,
  backgroundColor: colors.screenBackground,
  alignItems: "center",
});

interface Props extends NavigationScreenConfigProps {
  updateCurrentUser(user: any): void;
}

const validateFields = (
  email: string,
  password: string,
  passwordConfirmation: string
): boolean => {
  return (
    email.length > 0 &&
    validEmail(email) &&
    password.length > 0 &&
    passwordConfirmation.length > 0 &&
    password === passwordConfirmation
  );
};

const RegisterScreen = ({ navigation, updateCurrentUser }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const passwordField = useRef(null);
  const passwordConfirmationField = useRef(null);

  const valid = validateFields(email, password, passwordConfirmation);

  const handleOnPress = () => {
    if (valid) {
      setLoading(true);
      RegisterRequest({ email, password })
        .then(resp => {
          setLoading(false);
          if (resp.ok) {
            SetAuthenticationToken(resp.token);
            updateCurrentUser(resp.user);
            SetCurrentUser(resp.user);
            navigation.replace("AuthLoading");
            notice("Welcome to Budgetal!", 4000);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Container>
      <StatusBar barStyle="dark-content" />
      <FormTitle>Welcome to Budgetal!</FormTitle>
      <FieldContainer position="first">
        <TextInput
          autoFocus={true}
          keyboardType="email-address"
          underlineColorAndroid={"transparent"}
          style={{ height: 50 }}
          placeholder="Email"
          autoCapitalize={"none"}
          autoCorrect={false}
          onSubmitEditing={() => focus(passwordField)}
          returnKeyType="next"
          enablesReturnKeyAutomatically={true}
          onChangeText={email => setEmail(email.trim())}
        />
      </FieldContainer>
      <FieldContainer>
        <TextInput
          style={{ height: 50 }}
          enablesReturnKeyAutomatically={true}
          secureTextEntry={true}
          autoCapitalize={"none"}
          underlineColorAndroid={"transparent"}
          ref={passwordField}
          placeholder="Password"
          returnKeyType="next"
          onSubmitEditing={() => focus(passwordConfirmationField)}
          onChangeText={setPassword}
        />
      </FieldContainer>
      <FieldContainer>
        <TextInput
          style={{ height: 50 }}
          enablesReturnKeyAutomatically={true}
          secureTextEntry={true}
          autoCapitalize={"none"}
          underlineColorAndroid={"transparent"}
          ref={passwordConfirmationField}
          placeholder="Password Confirmation"
          returnKeyType="done"
          onSubmitEditing={handleOnPress}
          onChangeText={setPasswordConfirmation}
        />
      </FieldContainer>
      <PrimaryButton
        title="Register"
        onPress={handleOnPress}
        loading={!valid || loading}
      />
    </Container>
  );
};

export default connect(
  null,
  dispatch => ({
    updateCurrentUser: user => {
      dispatch(updateCurrentUser(user));
    },
  })
)(RegisterScreen);
