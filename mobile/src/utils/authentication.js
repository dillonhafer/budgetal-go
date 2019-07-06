const SESSION_KEY = "_budgetal_session";
const USER_KEY = "_budgetal_user";

import * as SecureStore from "expo-secure-store";

export function SetAuthenticationToken(token) {
  try {
    return SecureStore.setItemAsync(SESSION_KEY, token);
  } catch (err) {
    return null;
  }
}
export function GetAuthenticationToken() {
  try {
    return SecureStore.getItemAsync(SESSION_KEY);
  } catch (err) {
    return null;
  }
}

export function SetCurrentUser(user) {
  try {
    return SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  } catch (err) {
    return null;
  }
}
export async function GetCurrentUser() {
  try {
    const userStorage = await SecureStore.getItemAsync(USER_KEY);
    if (
      userStorage === null ||
      userStorage === undefined ||
      userStorage === "undefined"
    ) {
      await RemoveAuthentication();
      return null;
    } else {
      return JSON.parse(userStorage);
    }
  } catch (err) {
    return null;
  }
}

export function RemoveAuthentication() {
  return Promise.all([
    SecureStore.deleteItemAsync(SESSION_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ]).catch(() => {
    return Promise.resolve();
  });
}

export async function IsAuthenticated() {
  const user = await SecureStore.getItemAsync(USER_KEY);
  if (user === null || user === undefined) {
    return false;
  } else {
    return true;
  }
}
