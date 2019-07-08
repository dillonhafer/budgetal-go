/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCurrentUser
// ====================================================

export interface GetCurrentUser_currentUser {
  __typename: "User";
  /**
   * Is user admin
   */
  admin: boolean;
  /**
   * User's avatar url
   */
  avatarUrl: string | null;
  /**
   * Email of user
   */
  email: string;
  /**
   * First name of user
   */
  firstName: any | null;
  /**
   * ID of the User
   */
  id: string;
  /**
   * Last name of user
   */
  lastName: any | null;
}

export interface GetCurrentUser {
  /**
   * Get the current logged in user
   */
  currentUser: GetCurrentUser_currentUser;
}
