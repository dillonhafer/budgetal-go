import { _post, _put, _delete } from 'api';

export function CreateExpenseRequest(budgetItemExpense) {
  return _post(`/budget-item-expenses`, budgetItemExpense);
}

export function UpdateExpenseRequest(budgetItemExpense) {
  return _put(
    `/budget-item-expenses/${budgetItemExpense.id}`,
    budgetItemExpense,
  );
}

export function DeleteExpenseRequest(id) {
  return _delete(`/budget-item-expenses/${id}`);
}
