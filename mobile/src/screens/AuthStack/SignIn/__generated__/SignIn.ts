/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SignIn
// ====================================================

export interface SignIn_signIn_user {
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

export interface SignIn_signIn {
  __typename: "SignIn";
  /**
   * ID of the session
   */
  authenticationToken: string | null;
  /**
   * User error message when email or password is incorrect
   */
  error: string | null;
  /**
   * User that was just signed in
   */
  user: SignIn_signIn_user | null;
}

export interface SignIn {
  /**
   * Sign in
   */
  signIn: SignIn_signIn | null;
}

export interface SignInVariables {
  email: string;
  password: string;
  deviceName?: string | null;
}
