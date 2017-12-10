import { combineReducers } from 'redux';

import annualBudgetItems from 'reducers/AnnualBudgetItems';
import budget from 'reducers/Budget';

const appReducers = combineReducers({
  annualBudgetItems,
  budget,
});

export default appReducers;
