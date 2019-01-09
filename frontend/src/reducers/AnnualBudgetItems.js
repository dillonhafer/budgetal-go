import {
  ANNUAL_ITEMS_FETCHED,
  ANNUAL_ITEMS_SHOW_FORM,
  ANNUAL_ITEMS_HIDE_FORM,
  ANNUAL_ITEMS_TOGGLE_YEAR_FORM,
  ANNUAL_ITEMS_ADDED,
  ANNUAL_ITEMS_UPDATED,
  ANNUAL_ITEMS_REMOVED,
} from 'action-types';

const initialState = {
  annualBudgetId: null,
  annualBudgetItems: [],
  selectedBudgetItem: null,
  visible: false,
  showForm: false,
};

export default function annulBudgetItemState(state = initialState, action) {
  switch (action.type) {
    case ANNUAL_ITEMS_ADDED:
      return {
        ...state,
        visible: false,
        annualBudgetItems: [...state.annualBudgetItems, action.item],
      };

    case ANNUAL_ITEMS_UPDATED:
      const ANNUAL_ITEMS_UPDATED_IDX = state.annualBudgetItems.findIndex(
        i => i.id === action.item.id,
      );
      return {
        ...state,
        visible: false,
        annualBudgetItems: state.annualBudgetItems.map((item, index) => {
          if (index !== ANNUAL_ITEMS_UPDATED_IDX) {
            return item;
          }

          return {
            ...item,
            ...action.item,
          };
        }),
      };

    case ANNUAL_ITEMS_REMOVED:
      const ANNUAL_ITEMS_REMOVED_IDX = state.annualBudgetItems.findIndex(
        i => i.id === action.item.id,
      );
      return {
        ...state,
        annualBudgetItems: [
          ...state.annualBudgetItems.slice(0, ANNUAL_ITEMS_REMOVED_IDX),
          ...state.annualBudgetItems.slice(ANNUAL_ITEMS_REMOVED_IDX + 1),
        ],
      };

    case ANNUAL_ITEMS_FETCHED:
      return {
        ...state,
        annualBudgetItems: action.annualBudgetItems,
        annualBudgetId: action.annualBudgetId,
      };

    case ANNUAL_ITEMS_SHOW_FORM:
      return {
        ...state,
        selectedBudgetItem: action.selectedBudgetItem,
        visible: true,
      };

    case ANNUAL_ITEMS_HIDE_FORM:
      return {
        ...state,
        visible: false,
        selectedBudgetItem: initialState.selectedBudgetItem,
      };

    case ANNUAL_ITEMS_TOGGLE_YEAR_FORM:
      return {
        ...state,
        showForm: action.showForm,
      };

    default:
      return state;
  }
}
