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
  date: string;
  id?: string | null;
  budgetItemId: number;
  amount: number;
  name: string;
}

export interface BudgetItemInput {
  amount: number;
  name: string;
  id?: string | null;
  budgetCategoryId: number;
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
