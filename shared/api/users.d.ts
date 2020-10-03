export interface Response {
  ok: boolean;
}

export function PasswordResetRequest({
  email,
}: {
  email: string;
}): Promise<Response>;

type User = {
  id: string;
  email: string;
};

interface RegisterResponse extends Response {
  token: string;
  user: User;
}

export function RegisterRequest({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<RegisterResponse>;

export function ResetPasswordRequest({
  password,
  reset_password_token,
}: {
  password: string;
  reset_password_token: string;
}): Promise<Response>;
