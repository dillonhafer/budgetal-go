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
  avatarUrl: string | null;
  /**
   * Email of user
   */
  email: string;
  /**
   * First name of user
   */
  firstName: string | null;
  /**
   * ID of the User
   */
  id: string;
  /**
   * Last name of user
   */
  lastName: string | null;
}

export interface GetCurrentUser {
  /**
   * Get the current logged in user
   */
  currentUser: GetCurrentUser_currentUser;
}
