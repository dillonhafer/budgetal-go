import { colors } from "@shared/theme";
import { SplitBackground } from "@src/components/Card";
import { Bold } from "@src/components/Text";
import Device from "@src/utils/Device";
import React, { useEffect, useState } from "react";
import { Keyboard, LayoutAnimation, StatusBar, View } from "react-native";
import Form from "./Form";
import LogoSeparator from "./LogoSeparator";
import styled from "styled-components/native";
import { NavigationScreenConfigProps } from "react-navigation";
const isTablet = Device.isTablet();

const Container = styled.View({
  backgroundColor: colors.primary,
  flex: 1,
});

const InnerContainer = styled.View({
  backgroundColor: colors.primary,
  flex: 1,
  flexDirection: "column",
  justifyContent: "space-between",
});

const ButtonContainer = styled.View({
  flex: 1,
  backgroundColor: "#fff",
});

const Button = styled.TouchableOpacity({
  padding: 18,
});

const RegisterButtonText = styled(Bold)({
  fontSize: 11,
  color: colors.primary,
  textAlign: "center",
});

interface Props extends NavigationScreenConfigProps {}

const SignInScreen = ({ navigation }: Props) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const didShow = () => {
    if (isTablet) {
      return;
    }
    LayoutAnimation.easeInEaseOut();
    setKeyboardVisible(true);
  };
  const didHide = () => {
    if (isTablet) {
      return;
    }
    LayoutAnimation.easeInEaseOut();
    setKeyboardVisible(false);
  };

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", didShow);
    Keyboard.addListener("keyboardDidHide", didHide);
  }, []);

  return (
    <Container>
      <InnerContainer>
        <StatusBar barStyle="light-content" />
        <LogoSeparator keyboardVisible={keyboardVisible} />
        <SplitBackground top={colors.primary} bottom={"#fff"}>
          <View style={{ alignItems: "center" }}>
            <Form
              forgotPassword={() => {
                navigation.navigate("ForgotPassword");
              }}
              afterSignIn={() => {
                navigation.navigate("AuthLoading");
              }}
            />
          </View>
        </SplitBackground>
        <ButtonContainer>
          <Button
            onPress={() => {
              navigation.navigate("Register");
            }}
          >
            <RegisterButtonText>I DON'T HAVE AN ACCOUNT</RegisterButtonText>
          </Button>
        </ButtonContainer>
      </InnerContainer>
    </Container>
  );
};

SignInScreen.navigationOptions = {
  headerBackTitle: null,
};

export default SignInScreen;
