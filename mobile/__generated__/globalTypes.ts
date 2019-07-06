/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface AnnualBudgetItemInput {
  interval: number;
  amount: number;
  dueDate: string;
  name: string;
  id?: string | null;
  annualBudgetId: number;
  paid: boolean;
}

export interface BudgetItemExpenseInput {
  date: string;
  id?: string | null;
  budgetItemId: number;
  amount: number;
  name: string;
}

export interface BudgetItemInput {
  budgetCategoryId: number;
  amount: number;
  name: string;
  id?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
