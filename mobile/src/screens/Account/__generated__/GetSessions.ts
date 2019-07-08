/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSessions
// ====================================================

export interface GetSessions_sessions_active {
  __typename: "Session";
  /**
   * ID of the session
   */
  authenticationKey: string;
  /**
   * Time session started
   */
  createdAt: any;
  /**
   * IP address used when session started
   */
  ipAddress: string | null;
  /**
   * UserAgent of session when it started
   */
  userAgent: string;
  /**
   * Name of device session started on
   */
  deviceName: any | null;
}

export interface GetSessions_sessions_expired {
  __typename: "Session";
  /**
   * ID of the session
   */
  authenticationKey: string;
  /**
   * Time session started
   */
  createdAt: any;
  /**
   * Time session ended
   */
  expiredAt: any | null;
  /**
   * IP address used when session started
   */
  ipAddress: string | null;
  /**
   * UserAgent of session when it started
   */
  userAgent: string;
  /**
   * Name of device session started on
   */
  deviceName: any | null;
}

export interface GetSessions_sessions {
  __typename: "Sessions";
  /**
   * Active Sessions
   */
  active: GetSessions_sessions_active[];
  /**
   * Expired Sessions
   */
  expired: GetSessions_sessions_expired[];
}

export interface GetSessions {
  /**
   * Get sessiosn for the current user
   */
  sessions: GetSessions_sessions;
}
