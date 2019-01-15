import moment from 'moment';

import {
  BUDGET_LOADED,
  BUDGET_INCOME_UPDATED,
  BUDGET_CATEGORY_UPDATED,
  BUDGET_CATEGORY_IMPORTED,
  BUDGET_ITEM_NEW,
  BUDGET_ITEM_UPDATED,
  BUDGET_ITEM_SAVED,
  BUDGET_ITEM_DELETED,
  BUDGET_ITEM_EXPENSE_NEW,
  BUDGET_ITEM_EXPENSE_CREATED,
  BUDGET_ITEM_EXPENSE_UPDATED,
  BUDGET_ITEM_EXPENSE_REMOVED,
  BUDGET_ITEM_EXPENSE_IMPORTED,
  BUDGET_ITEM_EXPENSE_SELECTED,
  BUDGET_ITEM_EXPENSE_UNSELECTED,
} from 'constants/action-types';

const initialBudgetCategories = [
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
];

const initialBudgetCategory = () => {
  if (window.location.hash) {
    const hashCategory = window.location.hash.replace('#', '');
    return initialBudgetCategories.find(c => {
      return c.name.toLowerCase().replace('/', '-') === hashCategory;
    });
  }
  return initialBudgetCategories[0];
};

const initialBudgetState = {
  budget: {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    income: 0,
  },
  budgetCategories: initialBudgetCategories,
  budgetItems: [],
  budgetItemExpenses: [],
  currentBudgetCategory: initialBudgetCategory(),
  selectedExpense: null,
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
        budgetItems: action.budgetItems,
        budgetItemExpenses: action.budgetItemExpenses,
      };
    case BUDGET_CATEGORY_UPDATED:
      return {
        ...state,
        currentBudgetCategory: action.budgetCategory,
      };
    case BUDGET_INCOME_UPDATED:
      return {
        ...state,
        budget: {
          ...state.budget,
          income: action.income,
        },
      };
    case BUDGET_ITEM_UPDATED:
      return {
        ...state,
        budgetItems: state.budgetItems.map(item => {
          if (
            item.budgetCategoryId === action.budgetItem.budgetCategoryId &&
            item.id === action.budgetItem.id
          ) {
            return {
              ...item,
              ...action.budgetItem,
            };
          }

          return item;
        }),
      };
    case BUDGET_ITEM_EXPENSE_UPDATED:
      return {
        ...state,
        budgetItemExpenses: state.budgetItemExpenses.map(expense => {
          if (
            expense.budgetItemId === action.budgetItemExpense.budgetItemId &&
            expense.id === action.budgetItemExpense.id
          ) {
            return {
              ...expense,
              ...action.budgetItemExpense,
            };
          }

          return expense;
        }),
      };
    case BUDGET_ITEM_SAVED:
      return {
        ...state,
        budgetItems: state.budgetItems.map(item => {
          if (
            item.budgetCategoryId === action.budgetItem.budgetCategoryId &&
            item.id === null
          ) {
            return {
              ...item,
              ...action.budgetItem,
            };
          }

          return item;
        }),
      };
    case BUDGET_ITEM_NEW:
      return {
        ...state,
        budgetItems: [
          ...state.budgetItems,
          {
            id: null,
            budgetCategoryId: action.budgetCategoryId,
            amount: 0.0,
            name: '',
          },
        ],
      };
    case BUDGET_ITEM_DELETED:
      const item_deleted_idx = state.budgetItems.findIndex(i => {
        return (
          i.budgetCategoryId === action.budgetItem.budgetCategoryId &&
          i.id === action.budgetItem.id
        );
      });
      return {
        ...state,
        budgetItems: [
          ...state.budgetItems.slice(0, item_deleted_idx),
          ...state.budgetItems.slice(item_deleted_idx + 1),
        ],
        budgetItemExpenses: state.budgetItemExpenses.filter(e => {
          return e.budgetItemId !== action.budgetItem.id;
        }),
      };
    case BUDGET_ITEM_EXPENSE_REMOVED:
      const expense_deleted_idx = state.budgetItemExpenses.findIndex(e => {
        return (
          e.budgetItemId === action.budgetItemExpense.budgetItemId &&
          e.id === action.budgetItemExpense.id
        );
      });
      return {
        ...state,
        budgetItemExpenses: [
          ...state.budgetItemExpenses.slice(0, expense_deleted_idx),
          ...state.budgetItemExpenses.slice(expense_deleted_idx + 1),
        ],
      };
    case BUDGET_ITEM_EXPENSE_NEW:
      return {
        ...state,
        budgetItemExpenses: [
          ...state.budgetItemExpenses,
          {
            id: null,
            budgetItemId: action.budgetItemId,
            amount: 1.0,
            date: moment().format('YYYY-MM-DD'),
            name: '',
          },
        ],
      };
    case BUDGET_ITEM_EXPENSE_CREATED:
      return {
        ...state,
        budgetItemExpenses: [
          ...state.budgetItemExpenses,
          action.budgetItemExpense,
        ],
      };
    case BUDGET_CATEGORY_IMPORTED:
      return {
        ...state,
        budgetItems: [...state.budgetItems, ...action.budgetItems],
      };
    case BUDGET_ITEM_EXPENSE_IMPORTED:
      return {
        ...state,
        budgetItemExpenses: [
          ...state.budgetItemExpenses,
          action.budgetItemExpense,
        ],
      };
    case BUDGET_ITEM_EXPENSE_UNSELECTED:
      return {
        ...state,
        showExpenseModal: false,
        selectedExpense: null,
      };
    case BUDGET_ITEM_EXPENSE_SELECTED:
      return {
        ...state,
        showExpenseModal: true,
        selectedExpense: action.selectedExpense,
      };
    default:
      return state;
  }
}
