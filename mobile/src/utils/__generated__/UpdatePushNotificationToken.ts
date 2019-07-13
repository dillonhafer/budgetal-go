/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdatePushNotificationToken
// ====================================================

export interface UpdatePushNotificationToken_updatePushNotificationToken {
  __typename: "User";
  /**
   * ID of the User
   */
  id: string;
}

export interface UpdatePushNotificationToken {
  /**
   * Update the sessions push notification token
   */
  updatePushNotificationToken: UpdatePushNotificationToken_updatePushNotificationToken | null;
}

export interface UpdatePushNotificationTokenVariables {
  token: string;
}
