import { _get, _post, _delete } from 'api';

export function SignInRequest({ email, password }) {
  return _post('/sign-in', { email, password });
}

export function SignOutRequest() {
  return _delete('/sign-out');
}

export function AllSessionsRequest() {
  return _get('/sessions');
}

export function EndSessionRequest(authenticationKey) {
  return _delete(`/sessions/${authenticationKey}`);
}
