import {
  NET_WORTH_ASSET_ADDED,
  NET_WORTH_ASSET_UPDATED,
  NET_WORTH_ASSET_DELETED,
} from 'constants/action-types';

import {
  CreateAssetRequest,
  UpdateAssetRequest,
  DeleteAssetRequest,
} from '@shared/api/assets-liabilities';

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
      }),
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
      }),
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
      }),
  );

const key = a => (a.isAsset ? 'assets' : 'liabilities');

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
