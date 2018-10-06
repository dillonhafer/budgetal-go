import {
  LOAD_NET_WORTH_YEAR,
  REFRESH_NET_WORTH_YEAR,
  NET_WORTH_REQUEST_FINISHED,
  NET_WORTH_YEAR_LOADED,
  NET_WORTH_ASSET_ADDED,
  NET_WORTH_ASSET_UPDATED,
  NET_WORTH_ASSET_DELETED,
  NET_WORTH_ITEM_ADDED,
  NET_WORTH_ITEM_UPDATED,
  NET_WORTH_ITEM_DELETED,
  NET_WORTH_ITEMS_IMPORTED,
} from 'redux-constants/action-types';

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
          items: m.items.map(
            i => (i.id === action.item.id ? { ...i, ...action.item } : i),
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
