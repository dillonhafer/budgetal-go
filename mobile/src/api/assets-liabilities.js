import { _post, _put, _delete } from 'api';

export function CreateAssetRequest({ name, isAsset }) {
  return _post('/assets-liabilities', { name, isAsset });
}

export function UpdateAssetRequest({ id, name }) {
  return _put(`/assets-liabilities/${id}`, name);
}

export function DeleteAssetRequest(id) {
  return _delete(`/assets-liabilities/${id}`);
}
