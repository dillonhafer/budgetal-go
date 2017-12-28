import { _post, _put, _patch } from 'api';

export function RegisterRequest({ email, password }) {
  return _post('/register', { email, password });
}

export function PasswordResetRequest({ email }) {
  return _post('/reset-password', { email });
}

export function ResetPasswordRequest({ password, reset_password_token }) {
  return _put('/reset-password', { password, reset_password_token });
}

export function UpdateAccountInfoRequest(formData) {
  return _patch('/update-user', formData, {
    'Content-Type': 'multipart/form-data',
  });
}

export function UpdatePushNotificationTokenRequest(token) {
  return _put('/update-push-notification-token', { token });
}

export function ChangePasswordRequest({ password, currentPassword }) {
  return _patch('/update-password', { password, currentPassword });
}
