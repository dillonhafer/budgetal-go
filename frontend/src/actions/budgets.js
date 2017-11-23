import { BUDGET_LOADED, BUDGET_CATEGORY_UPDATED } from 'action-types';

export const budgetLoaded = ({ budget, budgetCategories }) => {
  return {
    type: BUDGET_LOADED,
    budget,
    budgetCategories,
  };
};

export const updateBudgetCategory = ({ budgetCategory }) => {
  return {
    type: BUDGET_CATEGORY_UPDATED,
    budgetCategory,
  };
};
