import {
  NET_WORTH_ITEM_ADDED,
  NET_WORTH_ITEM_UPDATED,
  NET_WORTH_ITEM_DELETED,
} from 'redux-constants/action-types';

import {
  CreateItemRequest,
  UpdateItemRequest,
  DeleteItemRequest,
} from '@shared/api/net-worth-items';

export const createNetWorthItem = ({ year, month, item }) => dispatch =>
  new Promise((resolve, reject) =>
    CreateItemRequest({ year, month, item })
      .then(resp => {
        if (resp.ok) {
          resolve(
            dispatch(
              netWorthItemAdded(year, month, {
                ...resp.item,
                isAsset: item.isAsset,
              }),
            ),
          );
        } else {
          reject(resp.error);
        }
      })
      .catch(error => {
        reject(error);
      }),
  );

export const updateNetWorthItem = ({ item }) => dispatch =>
  new Promise((resolve, reject) =>
    UpdateItemRequest(item)
      .then(resp => {
        if (resp.ok) {
          resolve(dispatch(netWorthItemUpdated(resp.item)));
        } else {
          reject(resp.error);
        }
      })
      .catch(error => {
        reject(error);
      }),
  );

export const deleteNetWorthItem = ({ item }) => dispatch =>
  new Promise((resolve, reject) =>
    DeleteItemRequest(item.id)
      .then(resp => {
        if (resp.ok) {
          resolve(dispatch(netWorthItemDeleted(item)));
        } else {
          reject(resp.error);
        }
      })
      .catch(error => {
        reject(error);
      }),
  );

const netWorthItemAdded = (year, month, item) => {
  return {
    type: NET_WORTH_ITEM_ADDED,
    item,
    year,
    month,
  };
};

const netWorthItemUpdated = item => {
  return {
    type: NET_WORTH_ITEM_UPDATED,
    item,
  };
};

const netWorthItemDeleted = item => {
  return {
    type: NET_WORTH_ITEM_DELETED,
    item,
  };
};
