import { _get } from 'api';

export function AdminUsersRequest() {
  return _get(`/admin/users`);
}
