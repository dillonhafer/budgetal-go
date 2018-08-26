import { _post, _put, _delete } from 'api';

export function CreateItemRequest({ year, month, item }) {
  return _post(`/net-worths/${year}/${month}/asset-liability-items`, item);
}

export function UpdateItemRequest({ id, amount }) {
  return _put(`/asset-liability-items/${id}`, amount);
}

export function DeleteItemRequest(id) {
  return _delete(`/asset-liability-items/${id}`);
}
