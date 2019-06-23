export interface Response {
  ok: boolean;
}

export function PasswordResetRequest({
  email,
}: {
  email: string;
}): Promise<Response>;

export function RegisterRequest({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Response>;
