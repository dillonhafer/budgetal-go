import { combineReducers } from 'redux';

import annualBudgetItems from 'reducers/AnnualBudgetItems';
import budget from 'reducers/Budget';
import sessions from 'reducers/Sessions';
import users from 'reducers/Users';

const appReducers = combineReducers({
  annualBudgetItems,
  budget,
  users,
  sessions,
});

export default appReducers;
