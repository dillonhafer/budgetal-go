import { _get, _put } from 'api';

export function BudgetRequest({ month, year }) {
  return _get(`/budgets/${year}/${month}`);
}

export function ImportCategoryRequest({ month, year }) {
  return _get(`/budgets/${year}/${month}`);
}

export function UpdateIncomeRequest({ month, year, income }) {
  return _put(`/budgets/${year}/${month}`, { income });
}
