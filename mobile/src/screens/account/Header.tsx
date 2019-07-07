import gql from "graphql-tag";
import React from "react";
import { useQuery } from "react-apollo";
import { GetCurrentUser } from "../Drawer/__generated__/GetCurrentUser";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@shared/theme";
import Monogram from "@src/components/Monogram";

const CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      admin
      avatarUrl
      email
      firstName
      id
      lastName
    }
  }
`;

const Container = styled.View({
  marginTop: 20,
});

const Row = styled.TouchableOpacity({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: 8,
  paddingBottom: 8,
  backgroundColor: "white",
  alignSelf: "stretch",
  borderWidth: 0.5,
  borderColor: colors.lines,
  borderLeftColor: "#fff",
  borderRightColor: "#fff",
});

const ProfileRow = styled.View({
  flexDirection: "row",
  alignItems: "center",
});

const ImageContainer = styled.View({
  marginLeft: 15,
  marginRight: 15,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 35,
  width: 70,
  height: 70,
  borderWidth: 2,
  borderColor: colors.lines,
  backgroundColor: "#aaa",
  overflow: "hidden",
});

const NameContainer = styled.View({});
const ArrowContainer = styled.View({
  paddingRight: 15,
});
const NameText = styled.Text({
  fontSize: 18,
  fontWeight: 700,
  color: "#444",
});

const EmailText = styled.Text({
  color: "#888",
});

interface Props {
  onPress(): void;
}

const Header = ({ onPress }: Props) => {
  const { data } = useQuery<GetCurrentUser>(CURRENT_USER);
  if (!data || !data.currentUser) {
    return null;
  }
  const user = data.currentUser;

  return (
    <Container>
      <Row onPress={onPress}>
        <ProfileRow>
          <ImageContainer>
            <Monogram user={user} size={70} />
          </ImageContainer>
          <NameContainer>
            <NameText>{[user.firstName, user.lastName].join(" ")}</NameText>
            <EmailText>{user.email}</EmailText>
          </NameContainer>
        </ProfileRow>
        <ArrowContainer>
          <Ionicons name="ios-arrow-forward" size={26} color={colors.lines} />
        </ArrowContainer>
      </Row>
    </Container>
  );
};

export default Header;
