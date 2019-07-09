/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ResetPassword
// ====================================================

export interface ResetPassword_resetPassword {
  __typename: "Message";
  /**
   * Message
   */
  message: string;
}

export interface ResetPassword {
  /**
   * Resset a password from an email
   */
  resetPassword: ResetPassword_resetPassword;
}

export interface ResetPasswordVariables {
  password: string;
  token: string;
}
