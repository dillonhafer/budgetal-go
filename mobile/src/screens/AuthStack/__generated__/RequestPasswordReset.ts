/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RequestPasswordReset
// ====================================================

export interface RequestPasswordReset_requestPasswordReset {
  __typename: "Message";
  /**
   * Message
   */
  message: string;
}

export interface RequestPasswordReset {
  /**
   * Request a password reset email
   */
  requestPasswordReset: RequestPasswordReset_requestPasswordReset;
}

export interface RequestPasswordResetVariables {
  email: string;
}
