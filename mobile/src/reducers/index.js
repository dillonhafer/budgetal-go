import { combineReducers } from 'redux';

import annualBudgetItems from 'reducers/AnnualBudgetItems';
import budget from 'reducers/Budget';
import sessions from 'reducers/Sessions';

const appReducers = combineReducers({
  annualBudgetItems,
  budget,
  sessions,
});

export default appReducers;
