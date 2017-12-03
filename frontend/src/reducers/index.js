import { combineReducers } from 'redux';

import annualBudgetItems from 'reducers/AnnualBudgetItems';
import mortgageCalculator from 'reducers/MortgageCalculator';
import budget from 'reducers/Budget';

const appReducers = combineReducers({
  mortgageCalculator,
  annualBudgetItems,
  budget,
});

export default appReducers;
