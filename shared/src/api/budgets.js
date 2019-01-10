import { _get, _post, _put } from "./index";

export function BudgetRequest({ month, year }) {
  return _get(`/budgets/${year}/${month}`);
}

export function ImportCategoryRequest(id) {
  return _post(`/budget-categories/${id}/import`);
}

export function UpdateIncomeRequest({ month, year, income }) {
  return _put(`/budgets/${year}/${month}`, { income });
}
