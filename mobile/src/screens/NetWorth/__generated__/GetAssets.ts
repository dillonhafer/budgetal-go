/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAssets
// ====================================================

export interface GetAssets_assets {
  __typename: "AssetLiability";
  /**
   * ID of the asset/liability
   */
  id: string;
  /**
   * Is this an asset instead of a liability?
   */
  isAsset: boolean;
  /**
   * Name of the asset/liability
   */
  name: string;
}

export interface GetAssets {
  /**
   * Get the assets and liabilities for a user
   */
  assets: GetAssets_assets[];
}
