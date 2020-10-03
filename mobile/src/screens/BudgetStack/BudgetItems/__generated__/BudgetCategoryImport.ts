/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: BudgetCategoryImport
// ====================================================

export interface BudgetCategoryImport_budgetCategoryImport {
  __typename: "BudgetCategoryImport";
  /**
   * Import message
   */
  message: string;
}

export interface BudgetCategoryImport {
  /**
   * Imports budget categories from a previous budget
   */
  budgetCategoryImport: BudgetCategoryImport_budgetCategoryImport;
}

export interface BudgetCategoryImportVariables {
  id: string;
}
