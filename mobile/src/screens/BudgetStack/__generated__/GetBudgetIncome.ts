/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetBudgetIncome
// ====================================================

export interface GetBudgetIncome_budget {
  __typename: "Budget";
  /**
   * ID of the budget
   */
  id: string;
  /**
   * Expected Income for the month
   */
  income: string;
  /**
   * Calendar Month of the budget
   */
  month: number;
  /**
   * Calendar Year of the budget
   */
  year: number;
}

export interface GetBudgetIncome {
  /**
   * Get the budget for a given month
   */
  budget: GetBudgetIncome_budget;
}

export interface GetBudgetIncomeVariables {
  year: number;
  month: number;
}
