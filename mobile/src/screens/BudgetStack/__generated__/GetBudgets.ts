/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetBudgets
// ====================================================

export interface GetBudgets_budget {
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

export interface GetBudgets {
  /**
   * Get the budget for a given month
   */
  budget: GetBudgets_budget | null;
}

export interface GetBudgetsVariables {
  year: number;
  month: number;
}
