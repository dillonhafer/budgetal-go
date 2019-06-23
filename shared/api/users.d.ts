export interface Response {
  ok: boolean;
}

export function PasswordResetRequest({
  email,
}: {
  email: string;
}): Promise<Response>;
