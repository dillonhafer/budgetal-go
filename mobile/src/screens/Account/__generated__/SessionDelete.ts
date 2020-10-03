/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SessionDelete
// ====================================================

export interface SessionDelete_sessionsDelete {
  __typename: "Session";
  /**
   * ID of the session
   */
  authenticationKey: string;
}

export interface SessionDelete {
  /**
   * Deletes another session
   */
  sessionsDelete: SessionDelete_sessionsDelete | null;
}

export interface SessionDeleteVariables {
  authenticationKey: string;
}
