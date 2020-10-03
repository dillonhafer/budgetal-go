/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AssetLiabilityDelete
// ====================================================

export interface AssetLiabilityDelete_assetLiabilityDelete {
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

export interface AssetLiabilityDelete {
  /**
   * Deletes an asset/liability
   */
  assetLiabilityDelete: AssetLiabilityDelete_assetLiabilityDelete;
}

export interface AssetLiabilityDeleteVariables {
  id: string;
}
