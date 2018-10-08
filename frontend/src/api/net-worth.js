import { _get, _post } from 'api';

export function AllNetWorthsRequest({ year }) {
  return _get(`/net-worths/${year}`);
}

export function ImportNetWorthRequest({ year, month }) {
  return _post(`/net-worths/${year}/${month}/import`);
}
