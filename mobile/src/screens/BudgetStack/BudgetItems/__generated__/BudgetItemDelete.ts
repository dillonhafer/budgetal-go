/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: BudgetItemDelete
// ====================================================

export interface BudgetItemDelete_budgetItemDelete {
  __typename: "BudgetItem";
  /**
   * ID of the item
   */
  id: string;
}

export interface BudgetItemDelete {
  /**
   * Deletes a budget item
   */
  budgetItemDelete: BudgetItemDelete_budgetItemDelete;
}

export interface BudgetItemDeleteVariables {
  id: string;
}
