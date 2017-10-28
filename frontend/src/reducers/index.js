import { combineReducers } from 'redux';

import annualBudgetItems from './AnnualBudgetItems';
import mortgageCalculator from './MortgageCalculator';

const appReducers = combineReducers({
  mortgageCalculator,
  annualBudgetItems,
});

export default appReducers;
