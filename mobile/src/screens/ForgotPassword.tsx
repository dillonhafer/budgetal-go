import React, { Component, useState } from "react";
import { TextInput, StatusBar, KeyboardAvoidingView } from "react-native";

// API
import { PasswordResetRequest } from "@shared/api/users";

// Helpers
import { error, notice } from "@src/notify";

// Components
import { PrimaryButton, FieldContainer } from "@src/forms";
import { validEmail } from "@shared/helpers";
import styled from "styled-components/native";
import { NavigationScreenConfigProps } from "react-navigation";
import { FormTitle } from "@src/typography";
import { colors } from "@shared/theme";

const Container = styled(KeyboardAvoidingView).attrs({
  behvaior: "padding",
  keyboardVerticalOffset: 60,
})({
  flex: 1,
  backgroundColor: colors.screenBackground,
  alignItems: "center",
});

interface Props extends NavigationScreenConfigProps {}

const ForgotPasswordScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const valid = email.length > 0 && validEmail(email);

  const handleOnPress = () => {
    if (valid) {
      setLoading(true);
      PasswordResetRequest({ email })
        .then(resp => {
          setLoading(false);
          if (resp.ok) {
            navigation.goBack();
            notice(
              "We sent you an email with instructions on resetting your password",
              4000
            );
          }
        })
        .catch(() => {
          setLoading(false);
          error("Email is invalid");
        });
    }
  };

  return (
    <Container>
      <StatusBar barStyle="dark-content" />
      <FormTitle>Request a password reset</FormTitle>
      <FieldContainer position="first">
        <TextInput
          autoFocus={true}
          keyboardType="email-address"
          style={{ height: 50 }}
          placeholder="Email"
          underlineColorAndroid={"transparent"}
          autoCapitalize={"none"}
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleOnPress}
          enablesReturnKeyAutomatically={true}
          onChangeText={setEmail}
        />
      </FieldContainer>

      <PrimaryButton
        title="Request Password Reset"
        onPress={handleOnPress}
        loading={!valid || loading}
      />
    </Container>
  );
};

export default ForgotPasswordScreen;
