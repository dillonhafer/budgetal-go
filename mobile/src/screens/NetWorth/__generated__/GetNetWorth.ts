/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetNetWorth
// ====================================================

export interface GetNetWorth_netWorth_netWorthItems_asset {
  __typename: "AssetLiability";
  /**
   * ID of the asset/liability
   */
  id: string;
  /**
   * Name of the asset/liability
   */
  name: string;
  /**
   * Is this an asset instead of a liability?
   */
  isAsset: boolean;
}

export interface GetNetWorth_netWorth_netWorthItems {
  __typename: "NetWorthItem";
  /**
   * ID of the item
   */
  id: string;
  /**
   * Amount budgeted for this item
   */
  amount: string;
  asset: GetNetWorth_netWorth_netWorthItems_asset;
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
