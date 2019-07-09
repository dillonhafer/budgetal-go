import React, { useState, useRef } from "react";
import { TextInput, StatusBar, KeyboardAvoidingView } from "react-native";
import {
  SetAuthenticationToken,
  SetCurrentUser,
} from "@src/utils/authentication";
import { notice, error } from "@src/notify";
import { FormTitle } from "@src/typography";
import { PrimaryButton, FieldContainer, focus } from "@src/forms";
import { validEmail } from "@shared/helpers";
import styled from "styled-components/native";
import { NavigationScreenConfigProps } from "react-navigation";
import { colors } from "@shared/theme";
import gql from "graphql-tag";
import Constants from "expo-constants";
import { useMutation } from "react-apollo";
import { Register, RegisterVariables } from "./__generated__/Register";
const deviceName = Constants.deviceName;

const REGISTER = gql`
  mutation Register($email: String!, $password: String!, $deviceName: String) {
    register(email: $email, password: $password, deviceName: $deviceName) {
      authenticationToken
      error
      user {
        id
        email
        firstName
        lastName
        avatarUrl
      }
    }
  }
`;

const Container = styled(KeyboardAvoidingView).attrs({
  behvaior: "padding",
  keyboardVerticalOffset: 60,
})({
  flex: 1,
  backgroundColor: colors.screenBackground,
  alignItems: "center",
});

interface Props extends NavigationScreenConfigProps {}

const RegisterScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const passwordField = useRef(null);
  const passwordConfirmationField = useRef(null);

  const [register, { loading }] = useMutation<Register, RegisterVariables>(
    REGISTER,
    {
      variables: {
        email,
        password,
        deviceName,
      },
    }
  );

  const valid =
    email.length > 0 &&
    validEmail(email) &&
    password.length > 0 &&
    passwordConfirmation.length > 0 &&
    password === passwordConfirmation;

  const handleOnPress = () => {
    if (valid) {
      register().then(r => {
        if (r && r.data && r.data.register) {
          const register = r.data.register;
          if (register && register.authenticationToken && register.user) {
            SetAuthenticationToken(register.authenticationToken);
            SetCurrentUser(register.user);
            navigation.navigate("AuthLoading");
            setTimeout(() => notice("Welcome to Budgetal!", 4000), 1000);
          }

          if (register.error) {
            error(register.error);
          }
        }
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

export default RegisterScreen;
