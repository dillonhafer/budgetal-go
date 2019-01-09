import { _post, _patch, _delete } from "./index";

export function CreateItemRequest({ year, month, item }) {
  return _post(`/net-worths/${year}/${month}/net-worth-items`, item);
}

export function UpdateItemRequest({ id, amount }) {
  return _patch(`/net-worth-items/${id}`, { amount });
}

export function DeleteItemRequest(id) {
  return _delete(`/net-worth-items/${id}`);
}
