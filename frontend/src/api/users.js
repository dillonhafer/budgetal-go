import {_post} from 'api';

export function RegisterRequest({email, password}) {
  return _post('/register', {email, password});
}
