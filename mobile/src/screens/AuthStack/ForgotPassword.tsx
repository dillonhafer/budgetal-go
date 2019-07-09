import { validEmail } from "@shared/helpers";
import { colors } from "@shared/theme";
import { FieldContainer, PrimaryButton } from "@src/forms";
import { notice } from "@src/notify";
import { FormTitle } from "@src/typography";
import gql from "graphql-tag";
import React, { useState } from "react";
import { useMutation } from "react-apollo";
import { KeyboardAvoidingView, StatusBar, TextInput } from "react-native";
import { NavigationScreenConfigProps } from "react-navigation";
import styled from "styled-components/native";
import {
  RequestPasswordReset,
  RequestPasswordResetVariables,
} from "./__generated__/RequestPasswordReset";

const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
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

const ForgotPasswordScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [requestPasswordReset, { loading }] = useMutation<
    RequestPasswordReset,
    RequestPasswordResetVariables
  >(REQUEST_PASSWORD_RESET, { variables: { email } });

  const valid = email.length > 0 && validEmail(email);

  const handleOnPress = () => {
    if (valid) {
      requestPasswordReset().finally(() => {
        navigation.goBack();
        notice(
          "We sent you an email with instructions on resetting your password",
          4000
        );
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
