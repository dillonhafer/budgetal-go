import { colors } from "@shared/theme";
import { GetCurrentUser, IsAuthenticated } from "@src/utils/authentication";
import React, { useEffect } from "react";
import { ActivityIndicator, StatusBar } from "react-native";
import { NavigationScreenConfigProps } from "react-navigation";
import styled from "styled-components/native";

interface Props extends NavigationScreenConfigProps {
  updateCurrentUser(user: object): void;
}

const LoadingContainer = styled.View({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.primary,
});

const AuthLoadingScreen = ({ navigation, updateCurrentUser }: Props) => {
  useEffect(() => {
    IsAuthenticated().then(foundUser => {
      if (foundUser) {
        GetCurrentUser().then(user => {
          updateCurrentUser(user);
          navigation.navigate("App");
        });
        return;
      }

      navigation.navigate("SignIn");
    });
  }, []);

  return (
    <LoadingContainer>
      <ActivityIndicator color="white" size="large" />
      <StatusBar barStyle="light-content" />
    </LoadingContainer>
  );
};

import { connect } from "react-redux";
import { updateCurrentUser } from "@src/actions/users";
export default connect(
  null,
  dispatch => ({
    updateCurrentUser: user => {
      dispatch(updateCurrentUser(user));
    },
  })
)(AuthLoadingScreen);
