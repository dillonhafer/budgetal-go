import {
  LOAD_NET_WORTH_YEAR,
  REFRESH_NET_WORTH_YEAR,
  NET_WORTH_YEAR_LOADED,
  NET_WORTH_REQUEST_FINISHED,
} from 'redux-constants/action-types';

export const netWorthLoaded = ({ assets, liabilities, months }) => {
  const assetIds = assets.map(a => a.id);
  return {
    type: NET_WORTH_YEAR_LOADED,
    assets,
    liabilities,
    months: months.map(m => ({
      ...m,
      items: m.items.map(i => ({
        ...i,
        isAsset: assetIds.includes(i.assetId),
      })),
    })),
  };
};

export const netWorthRequestFinished = () => {
  return {
    type: NET_WORTH_REQUEST_FINISHED,
  };
};

export const loadYear = ({ year }) => {
  return {
    type: LOAD_NET_WORTH_YEAR,
    year,
  };
};

export const refreshYear = ({ year }) => {
  return {
    type: REFRESH_NET_WORTH_YEAR,
    year,
  };
};
