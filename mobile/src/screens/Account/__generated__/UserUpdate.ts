/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UserInput } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: UserUpdate
// ====================================================

export interface UserUpdate_userUpdate {
  __typename: "User";
  /**
   * ID of the User
   */
  id: string;
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
   * Last name of user
   */
  lastName: any | null;
}

export interface UserUpdate {
  /**
   * Update the current user
   */
  userUpdate: UserUpdate_userUpdate;
}

export interface UserUpdateVariables {
  userInput?: UserInput | null;
  file?: any | null;
}
