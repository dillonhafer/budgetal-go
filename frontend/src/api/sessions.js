import {_post, _delete} from 'api';

export function SignInRequest({email, password}) {
  return _post('/sign-in', {email, password});
}

export function SignOutRequest() {
  return _delete('/sign-out');
}
