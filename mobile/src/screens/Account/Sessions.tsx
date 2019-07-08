import { BlurViewInsetProps } from "@src/utils/navigation-helpers";
import gql from "graphql-tag";
import React, { useState } from "react";
import { useQuery } from "react-apollo";
import { RefreshControl, SectionList, StatusBar } from "react-native";
import styled from "styled-components/native";
import SessionRow from "./SessionRow";
import { GetSessions } from "./__generated__/GetSessions";

const GET_SESSIONS = gql`
  query GetSessions {
    sessions {
      active {
        authenticationToken
        createdAt
        ipAddress
        userAgent
        deviceName
      }
      expired {
        authenticationToken
        createdAt
        expiredAt
        ipAddress
        userAgent
        deviceName
      }
    }
  }
`;

const Container = styled.View({
  flex: 1,
  backgroundColor: "#fff",
});

const Header = styled.View({
  borderWidth: 0.5,
  borderColor: "#AAA",
  backgroundColor: "#f7f7f7",
  borderLeftColor: "#f7f7f7",
  borderRightColor: "#f7f7f7",
  padding: 5,
});

const HeaderText = styled.Text({
  color: "#AAA",
});

const SectionHeader = ({ title = "" }) => (
  <Header>
    <HeaderText>{title}</HeaderText>
  </Header>
);

const SeparatorContainer = styled.View({
  backgroundColor: "#fff",
});

const SeparatorLine = styled.View({
  height: 1,
  width: "86%",
  backgroundColor: "#CED0CE",
  marginLeft: "14%",
});

const Separator = () => (
  <SeparatorContainer>
    <SeparatorLine />
  </SeparatorContainer>
);

const SessionsScreen = () => {
  const [currentSession] = useState("");
  const { data, loading, refetch } = useQuery<GetSessions>(GET_SESSIONS);
  const sessions =
    data && data.sessions ? data.sessions : { active: [], expired: [] };

  const sections = [
    {
      title: "Active Sessions",
      data: sessions.active,
    },
    {
      title: "Expired Sessions (last 10)",
      data: sessions.expired,
    },
  ];

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Container>
        <SectionList
          {...BlurViewInsetProps}
          contentInsetAdjustmentBehavior="automatic"
          keyExtractor={s => s.authenticationToken}
          sections={sections}
          refreshControl={
            <RefreshControl
              tintColor={"lightskyblue"}
              refreshing={loading}
              onRefresh={refetch}
            />
          }
          ItemSeparatorComponent={Separator}
          renderSectionHeader={({ section }) => (
            <SectionHeader title={section.title} />
          )}
          renderItem={({ item }) => {
            const disabled =
              !!item.expiredAt || item.authenticationToken === currentSession;
            return <SessionRow session={item} disabled={disabled} />;
          }}
        />
      </Container>
    </>
  );
};

export default React.memo(SessionsScreen);
