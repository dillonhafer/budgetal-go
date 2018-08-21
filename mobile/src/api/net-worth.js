import { _get } from 'api';

export function AllNetWorthsRequest(year) {
  return _get(`/net-worth/${year}`);
}

// export function CreateAnnualBudgetItemRequest(item) {
//   return _post('/annual-budget-items', item);
// }

// export function UpdateAnnualBudgetItemRequest(item) {
//   return _put(`/annual-budget-items/${item.id}`, item);
// }

// export function DeleteAnnualBudgetItemRequest(id) {
//   return _delete(`/annual-budget-items/${id}`);
// }
