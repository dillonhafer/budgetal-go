import { _get, _post, _delete } from "./index";

export function SignInRequest({ email, password, deviceName }) {
  return _post("/sign-in", { email, password, deviceName });
}

export function SignOutRequest() {
  return _delete("/sign-out");
}

export function AllSessionsRequest() {
  return _get("/sessions");
}

export function EndSessionRequest(authenticationKey) {
  return _delete(`/sessions/${authenticationKey}`);
}
