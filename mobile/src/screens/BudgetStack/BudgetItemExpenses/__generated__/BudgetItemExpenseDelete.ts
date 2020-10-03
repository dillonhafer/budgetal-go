/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: BudgetItemExpenseDelete
// ====================================================

export interface BudgetItemExpenseDelete_budgetItemExpenseDelete {
  __typename: "BudgetItemExpense";
  /**
   * ID of the expense
   */
  id: string;
}

export interface BudgetItemExpenseDelete {
  /**
   * Deletes a budget item expense
   */
  budgetItemExpenseDelete: BudgetItemExpenseDelete_budgetItemExpenseDelete;
}

export interface BudgetItemExpenseDeleteVariables {
  id: string;
}
