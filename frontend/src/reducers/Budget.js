import {
  BUDGET_LOADED,
  // BUDGET_UPDATED,
  // BUDGET_CATEGORY_UPDATED,
  // BUDGET_CATEGORY_IMPORTED,
  // BUDGET_DATE_UPDATED,
  // BUDGET_ITEM_NEW,
  // BUDGET_ITEM_SAVED,
  // BUDGET_ITEM_UPDATED,
  // BUDGET_ITEM_DELETED,
  // BUDGET_ITEM_MOVED,
  // BUDGET_ITEM_EXPENSE_NEW,
  // BUDGET_ITEM_EXPENSE_SAVED,
  // BUDGET_ITEM_EXPENSE_IMPORTED,
  // BUDGET_ITEM_EXPENSE_UPDATED,
  // BUDGET_ITEM_EXPENSE_DELETED,
} from 'constants/action-types';

const initialBudgetState = {
  budget: {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    income: 0,
  },
  budgetCategories: [
    { name: 'Charity' },
    { name: 'Saving' },
    { name: 'Housing' },
    { name: 'Utilities' },
    { name: 'Food' },
    { name: 'Clothing' },
    { name: 'Transportation' },
    { name: 'Medical/Health' },
    { name: 'Insurance' },
    { name: 'Personal' },
    { name: 'Recreation' },
    { name: 'Debts' },
  ],
  budgetItems: [],
  budgetItemExpenses: [],
};

export default function budgetState(state = initialBudgetState, action) {
  switch (action.type) {
    case BUDGET_LOADED:
      return {
        ...state,
        budget: {
          ...state.budget,
          ...action.budget,
        },
        budgetCategories: action.budgetCategories,
      };
    default:
      return state;
  }
}
