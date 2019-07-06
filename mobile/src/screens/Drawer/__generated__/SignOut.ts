/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SignOut
// ====================================================

export interface SignOut_signOut {
  __typename: "User";
  /**
   * ID of the User
   */
  id: string;
}

export interface SignOut {
  /**
   * Sign out the current user
   */
  signOut: SignOut_signOut | null;
}
