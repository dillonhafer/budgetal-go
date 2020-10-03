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
  name: string;
  date: string;
  id?: string | null;
  budgetItemId: number;
  amount: number;
}

export interface BudgetItemInput {
  name: string;
  id?: string | null;
  budgetCategoryId: number;
  amount: number;
}

export interface UserInput {
  firstName?: string | null;
  lastName?: string | null;
  password: string;
  email: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
