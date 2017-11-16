import { _get } from 'api';

export function BudgetRequest({ month, year }) {
  return _get(`/budgets/${year}/${month}`);
}
