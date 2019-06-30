import { DarkFormCard } from "@src/components/Card";
import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

const FooterContainer = styled.View({
  backgroundColor: "#d8dce0",
  marginBottom: 15,
});

const ImportText = styled.Text({
  textAlign: "center",
  fontWeight: 700,
  color: "#444",
});

const ImportRow = styled.View({
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
});
const ImportTextContainer = styled.View({
  flex: 1,
});

const ImportImage = styled.Image.attrs({
  source: require("@src/assets/images/csv.png"),
})({
  width: 64,
  height: 64,
  marginLeft: 5,
  marginVertical: 10,
});

const Footer = ({ onPress }: { onPress(): void }) => (
  <FooterContainer>
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      <DarkFormCard>
        <ImportRow>
          <ImportImage />
          <ImportTextContainer>
            <ImportText>Import Expenses</ImportText>
            <ImportText>From CSV</ImportText>
          </ImportTextContainer>
        </ImportRow>
      </DarkFormCard>
    </TouchableOpacity>
  </FooterContainer>
);

export default Footer;
