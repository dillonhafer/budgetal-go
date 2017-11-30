import {
  ANNUAL_ITEMS_FETCHED,
  ANNUAL_ITEMS_SHOW_FORM,
  ANNUAL_ITEMS_HIDE_FORM,
  ANNUAL_ITEMS_UPDATED,
  ANNUAL_ITEMS_ADDED,
  ANNUAL_ITEMS_TOGGLE_YEAR_FORM,
  ANNUAL_ITEMS_REMOVED,
} from 'action-types';

export const itemUpdated = item => {
  return {
    type: ANNUAL_ITEMS_UPDATED,
    item,
  };
};

export const itemAdded = item => {
  return {
    type: ANNUAL_ITEMS_ADDED,
    item,
  };
};

export const itemsFetched = (annualBudgetId, annualBudgetItems) => {
  return {
    type: ANNUAL_ITEMS_FETCHED,
    annualBudgetItems,
    annualBudgetId,
  };
};

export const updatedSelectedItem = selectedBudgetItem => {
  return {
    type: ANNUAL_ITEMS_SHOW_FORM,
    selectedBudgetItem,
  };
};

export const hideForm = () => {
  return {
    type: ANNUAL_ITEMS_HIDE_FORM,
  };
};

export const toggleYearForm = showForm => {
  return {
    type: ANNUAL_ITEMS_TOGGLE_YEAR_FORM,
    showForm,
  };
};

export const removeItem = item => {
  return {
    type: ANNUAL_ITEMS_REMOVED,
    item,
  };
};
