import React from "react";
import styled from "styled-components/native";

const Container = styled.View<{ keyboardVisible: boolean }>(
  ({ keyboardVisible }) => ({
    height: keyboardVisible ? 0 : "",
    marginTop: keyboardVisible ? 40 : 70,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  })
);

const Logo = styled.Image<{ keyboardVisible: boolean }>(
  ({ keyboardVisible }) => ({
    alignSelf: "center",
    height: keyboardVisible ? 0 : 60,
    width: keyboardVisible ? 0 : 60,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 13,
    marginBottom: 5,
  })
);

const Line = styled.View({
  flex: 1,
  backgroundColor: "#fff",
  height: 1,
});

const LogoContainer = styled.View({
  margin: 15,
  flexDirection: "column",
});

const LogoText = styled.Text({
  textAlign: "center",
  color: "#fff",
  backgroundColor: "transparent",
  fontFamily: "Lato-Light",
});

interface Props {
  keyboardVisible: boolean;
}

const LogoSeparator = ({ keyboardVisible }: Props) => {
  return (
    <Container keyboardVisible={keyboardVisible}>
      <Line />
      <LogoContainer>
        <Logo
          keyboardVisible={keyboardVisible}
          source={require("@src/assets/images/app_logo.png")}
        />
        <LogoText>Budgetal</LogoText>
      </LogoContainer>
      <Line />
    </Container>
  );
};

export default LogoSeparator;
