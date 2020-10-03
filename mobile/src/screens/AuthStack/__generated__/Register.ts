/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Register
// ====================================================

export interface Register_register_user {
  __typename: "User";
  /**
   * ID of the User
   */
  id: string;
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
  /**
   * User's avatar url
   */
  avatarUrl: string | null;
}

export interface Register_register {
  __typename: "NewSession";
  /**
   * ID of the session
   */
  authenticationToken: string | null;
  /**
   * User error message when email or password is invalid
   */
  error: string | null;
  /**
   * User the new session
   */
  user: Register_register_user | null;
}

export interface Register {
  /**
   * Register
   */
  register: Register_register | null;
}

export interface RegisterVariables {
  email: string;
  password: string;
  deviceName?: string | null;
}
