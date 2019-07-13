/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetNetWorth
// ====================================================

export interface GetNetWorth_netWorth_netWorthItems {
  __typename: "NetWorthItem";
  /**
   * ID of the item
   */
  id: string;
}

export interface GetNetWorth_netWorth {
  __typename: "NetWorth";
  /**
   * ID of the NetWorth
   */
  id: string;
  /**
   * Calendar Month of the NetWorth
   */
  month: number;
  netWorthItems: GetNetWorth_netWorth_netWorthItems[] | null;
  /**
   * Calendar Year of the NetWorth
   */
  year: number;
}

export interface GetNetWorth {
  /**
   * Get the networth for a given year
   */
  netWorth: GetNetWorth_netWorth[];
}

export interface GetNetWorthVariables {
  year: number;
}
