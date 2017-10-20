import {combineReducers} from 'redux';

import mortgageCalculator from './MortgageCalculator';

const appReducers = combineReducers({
  mortgageCalculator,
});

export default appReducers;
