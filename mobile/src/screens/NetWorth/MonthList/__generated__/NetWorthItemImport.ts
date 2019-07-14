/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: NetWorthItemImport
// ====================================================

export interface NetWorthItemImport_netWorthItemImport_netWorth_netWorthItems {
  __typename: "NetWorthItem";
  /**
   * ID of the item
   */
  id: string;
  /**
   * Name of the item
   */
  assetLiabilityId: string;
}

export interface NetWorthItemImport_netWorthItemImport_netWorth {
  __typename: "NetWorth";
  /**
   * ID of the NetWorth
   */
  id: string;
  /**
   * Calendar Month of the NetWorth
   */
  month: number;
  /**
   * Calendar Year of the NetWorth
   */
  year: number;
  netWorthItems: NetWorthItemImport_netWorthItemImport_netWorth_netWorthItems[];
}

export interface NetWorthItemImport_netWorthItemImport {
  __typename: "NetWorthItemImport";
  /**
   * Import message
   */
  message: string;
  /**
   * Net worth month with all items after import finished
   */
  netWorth: NetWorthItemImport_netWorthItemImport_netWorth;
}

export interface NetWorthItemImport {
  /**
   * Imports net worth items from a previous month
   */
  netWorthItemImport: NetWorthItemImport_netWorthItemImport;
}

export interface NetWorthItemImportVariables {
  year: number;
  month: number;
}
