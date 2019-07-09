/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface AnnualBudgetItemInput {
  id?: string | null;
  annualBudgetId: number;
  paid: boolean;
  interval: number;
  amount: number;
  dueDate: string;
  name: string;
}

export interface BudgetItemExpenseInput {
  name: string;
  date: string;
  id?: string | null;
  budgetItemId: number;
  amount: number;
}

export interface BudgetItemInput {
  id?: string | null;
  budgetCategoryId: number;
  amount: number;
  name: string;
}

export interface UserInput {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  password: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
