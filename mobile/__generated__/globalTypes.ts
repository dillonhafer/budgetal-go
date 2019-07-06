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

export interface BudgetItemInput {
  amount: number;
  name: string;
  id?: string | null;
  budgetCategoryId: number;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
