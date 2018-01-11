import { _get, _post, _delete } from 'api';
import { Constants } from 'expo';

export function SignInRequest({ email, password }) {
  return _post('/sign-in', {
    email,
    password,
    deviceName: Constants.deviceName,
  });
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
