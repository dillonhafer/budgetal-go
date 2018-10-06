import {
  LOAD_NET_WORTH_YEAR,
  REFRESH_NET_WORTH_YEAR,
  NET_WORTH_YEAR_LOADED,
  NET_WORTH_REQUEST_FINISHED,
  NET_WORTH_ITEMS_IMPORTED,
} from 'redux-constants/action-types';
import { notice } from 'notify';

import { ImportNetWorthRequest } from 'api/net-worth';

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

export const importNetWorthItems = ({ year, month }) => dispatch =>
  new Promise((resolve, reject) =>
    ImportNetWorthRequest({ year, month })
      .then(resp => {
        if (resp.ok) {
          if (resp.items.length) {
            resolve(
              dispatch(importedNetWorths(resp.items, resp.items[0].netWorthId)),
            );
          }
          notice(resp.message);
        } else {
          reject(resp.error);
        }
      })
      .catch(error => {
        reject(error);
      }),
  );

const importedNetWorths = (items, netWorthId) => {
  return {
    type: NET_WORTH_ITEMS_IMPORTED,
    items,
    netWorthId,
  };
};
