import { AllNetWorthsRequest } from "@shared/api/net-worth";
import {
  netWorthLoaded,
  netWorthRequestFinished,
  LOAD_NET_WORTH_YEAR,
  REFRESH_NET_WORTH_YEAR,
} from "@src/reducers/NetWorth";

const apiMiddleware = () => next => action => {
  next(action);

  switch (action.type) {
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
