const LOAD_NET_WORTH_YEAR = "LOAD_NET_WORTH_YEAR";
const REFRESH_NET_WORTH_YEAR = "REFRESH_NET_WORTH_YEAR";
const NET_WORTH_YEAR_LOADED = "NET_WORTH_YEAR_LOADED";
const NET_WORTH_REQUEST_FINISHED = "NET_WORTH_REQUEST_FINISHED";

const NET_WORTH_ITEMS_IMPORTED = "NET_WORTH_ITEMS_IMPORTED";
const NET_WORTH_ASSET_ADDED = "NET_WORTH_ASSET_ADDED";
const NET_WORTH_ASSET_UPDATED = "NET_WORTH_ASSET_UPDATED";
const NET_WORTH_ASSET_DELETED = "NET_WORTH_ASSET_DELETED";

const NET_WORTH_ITEM_ADDED = "NET_WORTH_ITEM_ADDED";
const NET_WORTH_ITEM_UPDATED = "NET_WORTH_ITEM_UPDATED";
const NET_WORTH_ITEM_DELETED = "NET_WORTH_ITEM_DELETED";

import {
  CreateAssetRequest,
  UpdateAssetRequest,
  DeleteAssetRequest,
} from "@shared/api/assets-liabilities";

import {
  CreateItemRequest,
  UpdateItemRequest,
  DeleteItemRequest,
} from "@shared/api/net-worth-items";

import { notice } from "@src/notify";
import { ImportNetWorthRequest } from "@shared/api/net-worth";

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
              dispatch(importedNetWorths(resp.items, resp.items[0].netWorthId))
            );
          }
          notice(resp.message);
        } else {
          reject(resp.error);
        }
      })
      .catch(error => {
        reject(error);
      })
  );

const importedNetWorths = (items, netWorthId) => {
  return {
    type: NET_WORTH_ITEMS_IMPORTED,
    items,
    netWorthId,
  };
};

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
              })
            )
          );
        } else {
          reject(resp.error);
        }
      })
      .catch(error => {
        reject(error);
      })
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
      })
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
      })
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

export const createAssetLiability = asset => dispatch =>
  new Promise((resolve, reject) =>
    CreateAssetRequest(asset)
      .then(resp => {
        if (resp.ok) {
          resolve(dispatch(assetAdded(resp.assetLiability)));
        } else {
          reject(resp.error);
        }
      })
      .catch(error => {
        reject(error);
      })
  );

export const updateAssetLiability = asset => dispatch =>
  new Promise((resolve, reject) =>
    UpdateAssetRequest(asset)
      .then(resp => {
        if (resp.ok) {
          resolve(dispatch(assetUpdated(resp.assetLiability)));
        } else {
          reject(resp.error);
        }
      })
      .catch(error => {
        reject(error);
      })
  );

export const deleteAssetLiability = asset => dispatch =>
  new Promise((resolve, reject) =>
    DeleteAssetRequest(asset.id)
      .then(resp => {
        if (resp.ok) {
          resolve(dispatch(assetDeleted(asset)));
        } else {
          reject(resp.error);
        }
      })
      .catch(error => {
        reject(error);
      })
  );

const key = a => (a.isAsset ? "assets" : "liabilities");

const assetAdded = asset => {
  return {
    type: NET_WORTH_ASSET_ADDED,
    asset,
    key: key(asset),
  };
};

const assetUpdated = asset => {
  return {
    type: NET_WORTH_ASSET_UPDATED,
    asset,
    key: key(asset),
  };
};

const assetDeleted = asset => {
  return {
    type: NET_WORTH_ASSET_DELETED,
    asset,
    key: key(asset),
  };
};

const initialState = {
  year: new Date().getFullYear(),
  loading: false,
  refreshing: false,
  assets: [],
  liabilities: [],
  months: [],
};

export default function netWorthState(state = initialState, action) {
  switch (action.type) {
    case LOAD_NET_WORTH_YEAR:
      return {
        ...state,
        year: action.year,
        loading: true,
      };
    case REFRESH_NET_WORTH_YEAR:
      return {
        ...state,
        year: action.year,
        refreshing: true,
      };
    case NET_WORTH_REQUEST_FINISHED:
      return {
        ...state,
        refreshing: false,
        loading: false,
      };
    case NET_WORTH_YEAR_LOADED:
      return {
        ...state,
        assets: action.assets,
        liabilities: action.liabilities,
        months: action.months,
      };
    case NET_WORTH_ASSET_ADDED:
      return {
        ...state,
        [action.key]: [...state[action.key], action.asset],
      };
    case NET_WORTH_ASSET_UPDATED:
      return {
        ...state,
        [action.key]: state[action.key].map(a => {
          if (a.id === action.asset.id) {
            return { ...a, name: action.asset.name };
          }
          return a;
        }),
      };
    case NET_WORTH_ASSET_DELETED:
      return {
        ...state,
        [action.key]: state[action.key].filter(a => a.id !== action.asset.id),
        months: state.months.map(m => ({
          ...m,
          items: m.items.filter(i => i.assetId !== action.asset.id),
        })),
      };
    case NET_WORTH_ITEM_ADDED:
      return {
        ...state,
        months: state.months.map(m => {
          if (m.month === action.month && m.year === action.year) {
            return { ...m, items: [...m.items, action.item] };
          }

          return m;
        }),
      };
    case NET_WORTH_ITEM_UPDATED:
      return {
        ...state,
        months: state.months.map(m => ({
          ...m,
          items: m.items.map(i =>
            i.id === action.item.id ? { ...i, ...action.item } : i
          ),
        })),
      };
    case NET_WORTH_ITEM_DELETED:
      return {
        ...state,
        months: state.months.map(m => ({
          ...m,
          items: m.items.filter(i => i.id !== action.item.id),
        })),
      };
    case NET_WORTH_ITEMS_IMPORTED:
      return {
        ...state,
        months: state.months.map(m => {
          if (m.id === action.netWorthId) {
            return {
              ...m,
              items: [
                ...m.items,
                ...action.items.map(i => {
                  const isAsset =
                    state.assets.findIndex(a => a.id === i.assetId) > -1;
                  return {
                    ...i,
                    isAsset,
                  };
                }),
              ],
            };
          }

          return m;
        }),
      };
    default:
      return state;
  }
}
