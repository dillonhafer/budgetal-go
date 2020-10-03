import { colors } from "@shared/theme";
import { FieldContainer, focus, PrimaryButton } from "@src/forms";
import { error, notice } from "@src/notify";
import { FormTitle } from "@src/typography";
import gql from "graphql-tag";
import React, { useRef, useState } from "react";
import { useMutation } from "react-apollo";
import { KeyboardAvoidingView, StatusBar, TextInput } from "react-native";
import { NavigationScreenConfigProps } from "react-navigation";
import styled from "styled-components/native";
import {
  ResetPassword,
  ResetPasswordVariables,
} from "./__generated__/ResetPassword";

const RESET_PASSWORD = gql`
  mutation ResetPassword($password: String!, $token: String!) {
    resetPassword(password: $password, token: $token) {
      message
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

const ResetPasswordScreen = ({ navigation }: Props) => {
  const token = navigation.getParam("reset_password_token");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [resetPassword, { loading }] = useMutation<
    ResetPassword,
    ResetPasswordVariables
  >(RESET_PASSWORD, { variables: { password, token } });

  const passwordConfirmationField = useRef(null);

  const valid =
    password.length > 0 &&
    passwordConfirmation.length > 0 &&
    password === passwordConfirmation;

  const handleOnPress = () => {
    if (valid) {
      resetPassword()
        .then(r => {
          const message = r && r.data && r.data.resetPassword.message;
          if (message && message.includes("expired")) {
            error(message, 8000);
            return;
          }

          notice("Your password has been reset!", 5000);
          navigation.goBack();
        })
        .catch(() => {
          error("You password reset token may have expired", 8000);
        });
    }
  };

  return (
    <Container>
      <StatusBar barStyle="dark-content" />
      <FormTitle>Create a new password</FormTitle>
      <FieldContainer position="first">
        <TextInput
          style={{ height: 50 }}
          enablesReturnKeyAutomatically={true}
          secureTextEntry={true}
          autoCapitalize={"none"}
          underlineColorAndroid={"transparent"}
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
        title="Reset Password"
        onPress={handleOnPress}
        loading={!valid || loading}
      />
    </Container>
  );
};

export default ResetPasswordScreen;
