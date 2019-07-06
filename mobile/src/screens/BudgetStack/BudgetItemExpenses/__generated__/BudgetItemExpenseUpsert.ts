/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { BudgetItemExpenseInput } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: BudgetItemExpenseUpsert
// ====================================================

export interface BudgetItemExpenseUpsert_budgetItemExpenseUpsert {
  __typename: "BudgetItemExpense";
  /**
   * ID of the expense
   */
  id: string;
  /**
   * ID of the item
   */
  budgetItemId: string;
  /**
   * Amount spent for this expense
   */
  amount: string;
  /**
   * Date of the expense
   */
  date: string;
  /**
   * Name of the expense
   */
  name: string;
}

export interface BudgetItemExpenseUpsert {
  /**
   * Upserts a budget item expense
   */
  budgetItemExpenseUpsert: BudgetItemExpenseUpsert_budgetItemExpenseUpsert;
}

export interface BudgetItemExpenseUpsertVariables {
  budgetItemExpenseInput: BudgetItemExpenseInput;
}
