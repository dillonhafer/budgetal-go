/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMonthlyStatistics
// ====================================================

export interface GetMonthlyStatistics_monthlyStatistic {
  __typename: "MonthlyStatistic";
  /**
   * Amount spent in that category
   */
  amountSpent: string;
  /**
   * Total spent in the month
   */
  totalSpent: string;
  /**
   * Percent spent in that category
   */
  percentSpent: string;
  /**
   * ID of the statistic
   */
  id: string;
  /**
   * Calendar Month of the statistic
   */
  month: number;
  /**
   * Name of the budget category
   */
  name: string;
  /**
   * Calendar Year of the statistic
   */
  year: number;
}

export interface GetMonthlyStatistics {
  /**
   * Get the statistics of a budget for a given month
   */
  monthlyStatistic: (GetMonthlyStatistics_monthlyStatistic | null)[] | null;
}

export interface GetMonthlyStatisticsVariables {
  year: number;
  month: number;
}
