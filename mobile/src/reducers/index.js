import { combineReducers } from 'redux';

import annualBudgetItems from 'reducers/AnnualBudgetItems';
import budget from 'reducers/Budget';
import users from 'reducers/Users';

const appReducers = combineReducers({
  annualBudgetItems,
  budget,
  users,
});

export default appReducers;
