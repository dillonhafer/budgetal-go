import { BUDGET_LOADED } from 'action-types';

export const budgetLoaded = ({ budget, budgetCategories }) => {
  return {
    type: BUDGET_LOADED,
    budget,
    budgetCategories,
  };
};
