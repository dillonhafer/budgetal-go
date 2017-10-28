import { _post } from 'api';

export function RegisterRequest({ email, password }) {
  return _post('/register', { email, password });
}

export function PasswordResetRequest({ email }) {
  return _post('/reset-password', { email });
}
