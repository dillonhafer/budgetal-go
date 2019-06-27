/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AnnualBudgetItemInput } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: AnnualBudgetItemUpsert
// ====================================================

export interface AnnualBudgetItemUpsert_annualBudgetItemUpsert {
  __typename: "AnnualBudgetItem";
  amount: string;
  annualBudgetId: string;
  dueDate: string;
  id: string;
  interval: number;
  name: string;
  paid: boolean;
}

export interface AnnualBudgetItemUpsert {
  /**
   * Upserts an annual budget item
   */
  annualBudgetItemUpsert: AnnualBudgetItemUpsert_annualBudgetItemUpsert | null;
}

export interface AnnualBudgetItemUpsertVariables {
  annualBudgetItemInput: AnnualBudgetItemInput;
}
