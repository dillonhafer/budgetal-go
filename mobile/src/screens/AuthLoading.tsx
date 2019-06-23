import { colors } from '@shared/theme';
import { GetCurrentUser, IsAuthenticated } from '@src/utils/authentication';
import React, { useEffect } from 'react';
import { ActivityIndicator, StatusBar } from 'react-native';
import { NavigationScreenConfigProps } from 'react-navigation';
import styled from 'styled-components/native';

interface Props extends NavigationScreenConfigProps {}

const LoadingContainer = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.primary,
});

const AuthLoadingScreen = ({ navigation }: Props) => {
  useEffect(() => {
    IsAuthenticated().then(foundUser => {
      if (foundUser) {
        GetCurrentUser().then(user => {
          // this.props.updateCurrentUser(user);
          navigation.navigate('App');
        });
        return;
      }

      navigation.navigate('SignIn');
    });
  }, []);

  return (
    <LoadingContainer>
      <ActivityIndicator color="white" size="large" />
      <StatusBar barStyle="light-content" />
    </LoadingContainer>
  );
};

export default AuthLoadingScreen;
