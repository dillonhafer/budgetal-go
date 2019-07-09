/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface AnnualBudgetItemInput {
  name: string;
  id?: string | null;
  annualBudgetId: number;
  paid: boolean;
  interval: number;
  amount: number;
  dueDate: string;
}

export interface BudgetItemExpenseInput {
  budgetItemId: number;
  amount: number;
  name: string;
  date: string;
  id?: string | null;
}

export interface BudgetItemInput {
  amount: number;
  name: string;
  id?: string | null;
  budgetCategoryId: number;
}

export interface UserInput {
  password: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
