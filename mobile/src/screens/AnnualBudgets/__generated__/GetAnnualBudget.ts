/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAnnualBudget
// ====================================================

export interface GetAnnualBudget_annualBudget_annualBudgetItems {
  __typename: "AnnualBudgetItem";
  id: string;
  annualBudgetId: string;
  name: string;
  dueDate: string;
  amount: string;
  interval: number;
  paid: boolean;
}

export interface GetAnnualBudget_annualBudget {
  __typename: "AnnualBudget";
  annualBudgetItems: (GetAnnualBudget_annualBudget_annualBudgetItems | null)[] | null;
  id: string;
  year: number;
}

export interface GetAnnualBudget {
  /**
   * Get the annual budget for a given year
   */
  annualBudget: GetAnnualBudget_annualBudget | null;
}

export interface GetAnnualBudgetVariables {
  year: number;
}
