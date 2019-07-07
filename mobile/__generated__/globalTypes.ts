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
  id?: string | null;
  budgetItemId: number;
  amount: number;
  name: string;
  date: string;
}

export interface BudgetItemInput {
  amount: number;
  name: string;
  id?: string | null;
  budgetCategoryId: number;
}

export interface UserInput {
  lastName?: string | null;
  password: string;
  email: string;
  firstName?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
