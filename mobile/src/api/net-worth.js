import { _get } from 'api';

export function AllNetWorthsRequest({ year }) {
  return _get(`/net-worths/${year}`);
}
