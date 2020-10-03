import { FieldContainer, PrimaryButton, focus, DangerButton } from "@src/forms";
import { notice } from "@src/notify";
import React, { useRef, useState } from "react";
import { StatusBar, TextInput, View } from "react-native";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import { NavigationScreenConfigProps } from "react-navigation";
import InsetScrollView from "@src/components/InsetScrollView";
import {
  UserChangePassword,
  UserChangePasswordVariables,
} from "./__generated__/UserChangePassword";

const USER_CHANGE_PASSWORD = gql`
  mutation UserChangePassword($password: String!, $currentPassword: String!) {
    userChangePassword(password: $password, currentPassword: $currentPassword) {
      id
    }
  }
`;

interface Props extends NavigationScreenConfigProps {}

const ChangePasswordScreen = ({ navigation }: Props) => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const passwordConfirmationField = useRef(null);
  const currentPasswordField = useRef(null);

  const [changePassword, { loading }] = useMutation<
    UserChangePassword,
    UserChangePasswordVariables
  >(USER_CHANGE_PASSWORD, {
    variables: {
      password,
      currentPassword,
    },
  });

  const valid =
    password.length > 0 &&
    currentPassword.length > 0 &&
    passwordConfirmation.length > 0 &&
    password === passwordConfirmation;

  const onDone = () => {
    if (valid && !loading) {
      changePassword().then(() => {
        notice("Password Successfully Changed");
        navigation.goBack();
      });
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <InsetScrollView>
        <>
          <FieldContainer position="first">
            <TextInput
              style={{ height: 50 }}
              enablesReturnKeyAutomatically={true}
              secureTextEntry={true}
              underlineColorAndroid={"transparent"}
              autoCapitalize={"none"}
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
              underlineColorAndroid={"transparent"}
              autoCapitalize={"none"}
              ref={passwordConfirmationField}
              placeholder="Password Confirmation"
              returnKeyType="next"
              onSubmitEditing={() => focus(currentPasswordField)}
              onChangeText={setPasswordConfirmation}
            />
          </FieldContainer>

          <View style={{ height: 10 }} />

          <FieldContainer position="first">
            <TextInput
              style={{ height: 50 }}
              enablesReturnKeyAutomatically={true}
              secureTextEntry={true}
              underlineColorAndroid={"transparent"}
              autoCapitalize={"none"}
              ref={currentPasswordField}
              placeholder="Current Password"
              returnKeyType="done"
              onSubmitEditing={onDone}
              onChangeText={setCurrentPassword}
            />
          </FieldContainer>

          <View style={{ height: 10 }} />

          <PrimaryButton
            onPress={onDone}
            title="Change Password"
            loading={loading}
            disabled={!valid || loading}
          />

          <DangerButton title="Cancel" onPress={() => navigation.goBack()} />
        </>
      </InsetScrollView>
    </>
  );
};

ChangePasswordScreen.navigationOptions = {
  title: "Change Password",
};

export default ChangePasswordScreen;
