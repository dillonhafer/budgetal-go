/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: BudgetIncomeUpdate
// ====================================================

export interface BudgetIncomeUpdate_budgetIncomeUpdate {
  __typename: "Budget";
  /**
   * ID of the budget
   */
  id: string;
  /**
   * Expected Income for the month
   */
  income: string;
}

export interface BudgetIncomeUpdate {
  /**
   * Update the income for a budget
   */
  budgetIncomeUpdate: BudgetIncomeUpdate_budgetIncomeUpdate;
}

export interface BudgetIncomeUpdateVariables {
  year: number;
  month: number;
  income: number;
}
