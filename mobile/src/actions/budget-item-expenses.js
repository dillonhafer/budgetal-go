import {
  BUDGET_ITEM_EXPENSE_NEW,
  BUDGET_ITEM_EXPENSE_CREATED,
  BUDGET_ITEM_EXPENSE_UPDATED,
  BUDGET_ITEM_EXPENSE_REMOVED,
  BUDGET_ITEM_EXPENSE_IMPORTED,
} from 'redux-constants/action-types';

export const newExpense = budgetItemId => {
  return {
    type: BUDGET_ITEM_EXPENSE_NEW,
    budgetItemId,
  };
};

export const createdExpense = budgetItemExpense => {
  return {
    type: BUDGET_ITEM_EXPENSE_CREATED,
    budgetItemExpense,
  };
};

export const updateExpense = budgetItemExpense => {
  return {
    type: BUDGET_ITEM_EXPENSE_UPDATED,
    budgetItemExpense,
  };
};

export const removeExpense = budgetItemExpense => {
  return {
    type: BUDGET_ITEM_EXPENSE_REMOVED,
    budgetItemExpense,
  };
};

export const importedExpense = budgetItemExpense => {
  return {
    type: BUDGET_ITEM_EXPENSE_IMPORTED,
    budgetItemExpense,
  };
};
