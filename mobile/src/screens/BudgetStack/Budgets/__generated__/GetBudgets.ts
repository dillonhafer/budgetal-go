/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetBudgets
// ====================================================

export interface GetBudgets_budget_budgetCategories_budgetItems_budgetItemExpenses {
  __typename: "BudgetItemExpense";
  /**
   * ID of the expense
   */
  id: string;
  /**
   * Name of the expense
   */
  name: string;
  /**
   * Date of the expense
   */
  date: string;
  /**
   * Amount spent for this expense
   */
  amount: string;
  /**
   * ID of the item
   */
  budgetItemId: string;
}

export interface GetBudgets_budget_budgetCategories_budgetItems {
  __typename: "BudgetItem";
  /**
   * ID of the item
   */
  id: string;
  /**
   * Name of the item
   */
  name: string;
  /**
   * Amount budgeted for this item
   */
  amount: string;
  budgetItemExpenses: (GetBudgets_budget_budgetCategories_budgetItems_budgetItemExpenses)[];
}

export interface GetBudgets_budget_budgetCategories {
  __typename: "BudgetCategory";
  /**
   * ID of the budget category
   */
  id: string;
  /**
   * Name of the category
   */
  name: string;
  budgetItems: (GetBudgets_budget_budgetCategories_budgetItems)[];
}

export interface GetBudgets_budget {
  __typename: "Budget";
  budgetCategories: (GetBudgets_budget_budgetCategories)[];
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
  budget: GetBudgets_budget;
}

export interface GetBudgetsVariables {
  year: number;
  month: number;
}
