import { combineReducers } from 'redux';

import annualBudgetItems from 'reducers/AnnualBudgetItems';
import mortgageCalculator from 'reducers/MortgageCalculator';
import budget from 'reducers/Budget';
import netWorth from 'reducers/NetWorth';

const appReducers = combineReducers({
  mortgageCalculator,
  annualBudgetItems,
  budget,
  netWorth,
});

export default appReducers;
