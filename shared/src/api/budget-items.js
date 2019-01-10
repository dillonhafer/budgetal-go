import { _post, _put, _delete } from "./index";

export function CreateItemRequest(budgetItem) {
  return _post(`/budget-items`, budgetItem);
}

export function UpdateItemRequest(budgetItem) {
  return _put(`/budget-items/${budgetItem.id}`, budgetItem);
}

export function DeleteItemRequest(id) {
  return _delete(`/budget-items/${id}`);
}
