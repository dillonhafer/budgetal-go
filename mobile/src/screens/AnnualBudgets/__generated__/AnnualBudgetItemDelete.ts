/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AnnualBudgetItemDelete
// ====================================================

export interface AnnualBudgetItemDelete_annualBudgetItemDelete_annualBudgetItems {
  __typename: "AnnualBudgetItem";
  id: string;
}

export interface AnnualBudgetItemDelete_annualBudgetItemDelete {
  __typename: "AnnualBudget";
  id: string;
  annualBudgetItems: (AnnualBudgetItemDelete_annualBudgetItemDelete_annualBudgetItems | null)[] | null;
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
