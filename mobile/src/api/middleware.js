import { BudgetRequest } from '@shared/api/budgets';
import { AllNetWorthsRequest } from '@shared/api/net-worth';
import { budgetLoaded, budgetRequestFinished } from 'actions/budgets';

import { netWorthLoaded, netWorthRequestFinished } from 'actions/net-worth';

import {
  LOAD_BUDGET,
  REFRESH_BUDGET,
  LOAD_NET_WORTH_YEAR,
  REFRESH_NET_WORTH_YEAR,
} from 'redux-constants/action-types';

const apiMiddleware = () => next => action => {
  next(action);

  switch (action.type) {
    case LOAD_BUDGET:
    case REFRESH_BUDGET:
      BudgetRequest({ month: action.month, year: action.year })
        .then(resp => {
          if (resp.ok) {
            next(budgetLoaded(resp));
            action.navigation.setParams({
              month: action.month,
              year: action.year,
            });
          }
        })
        .finally(() => {
          next(budgetRequestFinished());
        });
      break;
    case LOAD_NET_WORTH_YEAR:
    case REFRESH_NET_WORTH_YEAR:
      AllNetWorthsRequest({ year: action.year })
        .then(resp => {
          if (resp.ok) {
            next(netWorthLoaded(resp));
          }
        })
        .finally(() => {
          next(netWorthRequestFinished());
        });
      break;
    default:
      break;
  }
};

export default apiMiddleware;
