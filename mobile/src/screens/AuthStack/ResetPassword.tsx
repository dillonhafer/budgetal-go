// API
import { ResetPasswordRequest } from "@shared/api/users";
import { colors } from "@shared/theme";
// Components
import { FieldContainer, focus, PrimaryButton } from "@src/forms";
// Helpers
import { error, notice } from "@src/notify";
import { FormTitle } from "@src/typography";
import React, { useRef, useState } from "react";
import { KeyboardAvoidingView, StatusBar, TextInput } from "react-native";
import { NavigationScreenConfigProps } from "react-navigation";
import styled from "styled-components/native";

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
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordConfirmationField = useRef(null);

  const valid =
    password.length > 0 &&
    passwordConfirmation.length > 0 &&
    password === passwordConfirmation;

  const resetPassword = async () => {
    try {
      const reset_password_token = navigation.getParam("reset_password_token");
      const resp = await ResetPasswordRequest({
        password,
        reset_password_token,
      });
      if (resp && resp.ok) {
        navigation.navigate("SignIn");
        notice("Your password has been reset!", 2000);
      }
    } catch (err) {
      error("You password reset token may have expired");
    }
  };

  const handleOnPress = async () => {
    try {
      if (valid) {
        setLoading(true);
        await resetPassword();
      } else {
        error("Password does not match confirmation");
      }
    } catch (err) {
      error("You password reset token may have expired");
    } finally {
      setLoading(false);
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
