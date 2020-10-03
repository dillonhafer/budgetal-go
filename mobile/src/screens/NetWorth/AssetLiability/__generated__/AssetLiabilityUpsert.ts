/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AssetLiabilityUpsert
// ====================================================

export interface AssetLiabilityUpsert_assetLiabilityUpsert {
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

export interface AssetLiabilityUpsert {
  /**
   * Upsert an asset/liability
   */
  assetLiabilityUpsert: AssetLiabilityUpsert_assetLiabilityUpsert;
}

export interface AssetLiabilityUpsertVariables {
  id?: string | null;
  isAsset: boolean;
  name: string;
}
