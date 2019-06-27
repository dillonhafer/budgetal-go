/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AnnualBudgetItemDelete
// ====================================================

export interface AnnualBudgetItemDelete_annualBudgetItemDelete {
  __typename: "AnnualBudget";
  id: string;
}

export interface AnnualBudgetItemDelete {
  /**
   * Deletes an annual budget item
   */
  annualBudgetItemDelete: AnnualBudgetItemDelete_annualBudgetItemDelete | null;
}

export interface AnnualBudgetItemDeleteVariables {
  id: string;
}
