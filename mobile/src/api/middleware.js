import { BudgetRequest } from 'api/budgets';
import { budgetLoaded, budgetRequestFinished } from 'actions/budgets';
import { LOAD_BUDGET, REFRESH_BUDGET } from 'redux-constants/action-types';

const apiMiddleware = () => next => action => {
  next(action);

  switch (action.type) {
    case LOAD_BUDGET:
    case REFRESH_BUDGET:
      BudgetRequest({ month: action.month, year: action.year })
        .then(resp => {
          if (resp.ok) {
            next(budgetLoaded(resp));
          }
        })
        .finally(() => {
          next(budgetRequestFinished());
        });
      break;
    default:
      break;
  }
};

export default apiMiddleware;
