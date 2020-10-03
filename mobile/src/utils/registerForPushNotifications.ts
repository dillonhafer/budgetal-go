import { IsAuthenticated } from "@src/utils/authentication";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";
import { useEffect, useState } from "react";

const UPDATE_PUSH_NOTIFICATION_TOKEN = gql`
  mutation UpdatePushNotificationToken($token: String!) {
    updatePushNotificationToken(token: $token) {
      id
    }
  }
`;

function useRegisterForPushNotificationsAsync() {
  const [authenticated, setAuthenticated] = useState(false);
  const [status, setStatus] = useState<Permissions.PermissionStatus>(
    Permissions.PermissionStatus.UNDETERMINED
  );
  const [updatePushNotificationToken] = useMutation(
    UPDATE_PUSH_NOTIFICATION_TOKEN
  );

  useEffect(() => {
    if (authenticated) {
      if (status === Permissions.PermissionStatus.UNDETERMINED) {
        Permissions.getAsync(Permissions.NOTIFICATIONS).then(
          ({ status: existingStatus }) => {
            setStatus(existingStatus);
          }
        );
      }
    } else {
      IsAuthenticated().then(auth => {
        setAuthenticated(auth);
      });
    }
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated) {
      return;
    }

    if (status !== Permissions.PermissionStatus.GRANTED) {
      Permissions.askAsync(Permissions.NOTIFICATIONS).then(
        ({ status: finalStatus }) => {
          setStatus(finalStatus);
        }
      );
    }

    if (status === Permissions.PermissionStatus.GRANTED) {
      Notifications.getExpoPushTokenAsync().then(token => {
        updatePushNotificationToken({ variables: { token } });
      });
    }
  }, [status]);
}

export default useRegisterForPushNotificationsAsync;
