/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UserChangePassword
// ====================================================

export interface UserChangePassword_userChangePassword {
  __typename: "User";
  /**
   * ID of the User
   */
  id: string;
}

export interface UserChangePassword {
  /**
   * Update the current user's password
   */
  userChangePassword: UserChangePassword_userChangePassword;
}

export interface UserChangePasswordVariables {
  password: string;
  currentPassword: string;
}
