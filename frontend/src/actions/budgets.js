import {
  BUDGET_LOADED,
  BUDGET_CATEGORY_UPDATED,
  BUDGET_INCOME_UPDATED,
} from 'action-types';

export const budgetLoaded = ({
  budget,
  budgetCategories,
  budgetItems,
  budgetItemExpenses,
}) => {
  return {
    type: BUDGET_LOADED,
    budget,
    budgetCategories,
    budgetItems,
    budgetItemExpenses,
  };
};

export const updateBudgetCategory = ({ budgetCategory }) => {
  return {
    type: BUDGET_CATEGORY_UPDATED,
    budgetCategory,
  };
};

export const updateIncome = income => {
  return {
    type: BUDGET_INCOME_UPDATED,
    income,
  };
};
