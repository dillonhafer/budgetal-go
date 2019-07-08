import { browser } from "@src/utils/browserIcon";
import React from "react";
import { humanUA } from "@shared/helpers";
import Swipeout from "react-native-swipeout";
import { colors } from "@shared/theme";
import isEqual from "fast-deep-equal";
import styled from "styled-components/native";
import { Text, Alert } from "react-native";
import moment from "moment";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";
import { notice } from "@src/notify";
import {
  GetSessions_sessions_expired,
  GetSessions_sessions_active,
} from "./__generated__/GetSessions";

const DELETE_SESSION = gql`
  mutation DeleteSession($id: ID!) {
    id
  }
`;

interface Props {
  session: GetSessions_sessions_active | GetSessions_sessions_expired;
  disabled: boolean;
}

const Container = styled.View({
  backgroundColor: "#fff",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  height: 50,
});

const IconContainer = styled.View({
  width: "14%",
  alignItems: "center",
});
const TextContainer = styled.View({
  width: "86%",
});

const ItemText = styled.Text({
  fontSize: 14,
  textAlign: "left",
  color: "#444",
});

const RedText = styled.Text({
  color: colors.error,
});

const DeleteButton = styled.View({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
});

const confirmEndSession = (onConfirm: () => void) => {
  return () =>
    Alert.alert(
      "End Session?",
      `Are you sure you want to end this session?\n\n This will sign out the device using it. And you will need to sign in again on that device.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "End Session",
          style: "destructive",
          onPress: onConfirm,
        },
      ],
      { cancelable: true }
    );
};

const deleteButton = (onPress: () => void) => {
  return [
    {
      component: (
        <DeleteButton>
          <MaterialCommunityIcons name="delete" color={"#fff"} size={20} />
        </DeleteButton>
      ),
      backgroundColor: colors.error,
      underlayColor: colors.error + "70",
      onPress,
    },
  ];
};

const rightButton = (onConfirm: () => Promise<void>) => {
  const onPress = confirmEndSession(() => {
    onConfirm().then(() => notice("Session Signed Out"));
  });

  return deleteButton(onPress);
};

const SessionRow = ({ session, disabled }: Props) => {
  const [deleteSession] = useMutation(DELETE_SESSION, {
    variables: {
      authenticationToken: session.authenticationToken,
    },
  });

  const right = rightButton(deleteSession);
  return (
    <Swipeout
      autoClose={true}
      backgroundColor={colors.error}
      disabled={disabled}
      right={right}
    >
      <Container>
        <IconContainer>{browser(session.userAgent)}</IconContainer>
        <TextContainer>
          <ItemText>
            {humanUA(session.userAgent)}
            {session.deviceName ? ` - ${session.deviceName}` : ""}{" "}
          </ItemText>
          <Text>{moment(session.createdAt).fromNow()}</Text>
          {/* {isCurrent && <RedText>(current session)</RedText>} */}
        </TextContainer>
      </Container>
    </Swipeout>
  );
};

const shouldSkipUpdate = (prev: Props, next: Props) => {
  return (
    isEqual(prev.session, next.session) && isEqual(prev.disabled, next.disabled)
  );
};

export default React.memo(SessionRow, shouldSkipUpdate);
