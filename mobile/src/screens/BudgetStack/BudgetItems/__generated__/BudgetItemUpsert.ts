/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { BudgetItemInput } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: BudgetItemUpsert
// ====================================================

export interface BudgetItemUpsert_budgetItemUpsert {
  __typename: "BudgetItem";
  /**
   * ID of the item
   */
  id: string;
  /**
   * ID of the category
   */
  budgetCategoryId: string;
  /**
   * Amount budgeted for this item
   */
  amount: string;
  /**
   * Name of the item
   */
  name: string;
}

export interface BudgetItemUpsert {
  /**
   * Upserts a budget item
   */
  budgetItemUpsert: BudgetItemUpsert_budgetItemUpsert | null;
}

export interface BudgetItemUpsertVariables {
  budgetItemInput: BudgetItemInput;
}
