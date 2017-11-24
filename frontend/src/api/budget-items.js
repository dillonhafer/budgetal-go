import { _get } from 'api';

export function CreateItemRequest({ month, year }) {
  return _get(`/budgets/${year}/${month}`);
}

export function UpdateItemRequest({ month, year }) {
  return _get(`/budgets/${year}/${month}`);
}

export function DestroyItemRequest({ month, year }) {
  return _get(`/budgets/${year}/${month}`);
}
