import { combineReducers } from 'redux';

import annualBudgetItems from './AnnualBudgetItems';
import mortgageCalculator from './MortgageCalculator';
import budget from './Budget';

const appReducers = combineReducers({
  mortgageCalculator,
  annualBudgetItems,
  budget,
});

export default appReducers;
