import { Permissions, Notifications } from 'expo';
import { UpdatePushNotificationTokenRequest } from '@shared/api/users';
import { IsAuthenticated } from 'utils/authentication';

async function registerForPushNotificationsAsync() {
  const authenticated = await IsAuthenticated();
  if (!authenticated) {
    return;
  }

  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS,
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return;
  }

  const token = await Notifications.getExpoPushTokenAsync();
  return UpdatePushNotificationTokenRequest(token);
}

export default registerForPushNotificationsAsync;
