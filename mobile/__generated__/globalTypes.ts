/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface AnnualBudgetItemInput {
  paid: boolean;
  interval: number;
  amount: number;
  dueDate: string;
  name: string;
  id?: string | null;
  annualBudgetId: number;
}

export interface BudgetItemInput {
  id?: string | null;
  budgetCategoryId: number;
  amount: number;
  name: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
