const SESSION_KEY = '_budgetal_session';
const USER_KEY = '_budgetal_user';

export function SetAuthenticationToken(token) {
  return localStorage.setItem(SESSION_KEY, token);
}
export function GetAuthenticationToken() {
  return localStorage.getItem(SESSION_KEY) || '';
}

export function SetCurrentUser(user) {
  return localStorage.setItem(USER_KEY, JSON.stringify(user));
}
export function GetCurrentUser() {
  const userStorage = localStorage.getItem(USER_KEY);
  if (
    userStorage === null ||
    userStorage === undefined ||
    userStorage === 'undefined'
  ) {
    RemoveAuthentication();
    return null;
  } else {
    return JSON.parse(userStorage);
  }
}

export function RemoveAuthentication() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(USER_KEY);
}

export function IsAuthenticated() {
  return localStorage.getItem(USER_KEY) !== null;
}
