import {
  GetAuthenticationToken,
  RemoveAuthentication,
  IsAuthenticated,
} from "@src/utils/authentication";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-link-http";
import Constants from "expo-constants";
import { onError } from "apollo-link-error";
import { Updates } from "expo";

let __baseURL = "https://api.budgetal.com";
if (__DEV__) {
  const expoHost = Constants.manifest.debuggerHost || "";
  const port = "3000";
  __baseURL = "http://" + expoHost.replace(/:\d+/, `:${port}`);
}
export const baseURL = __baseURL;

const setAuthorizationLink = setContext(async () => {
  const token = await GetAuthenticationToken();
  return {
    headers: { "X-Budgetal-Session": token },
  };
});

const unauthorizedLink = onError(({ networkError }) => {
  if (networkError && networkError.statusCode === 401) {
    IsAuthenticated().then(auth => {
      RemoveAuthentication();

      if (auth) {
        Updates.reload();
      }
    });
  }
});

const link = new HttpLink({
  uri: `${baseURL}/graphql`,
  credentials: "include",
});

export const createApolloClient = () =>
  new ApolloClient({
    link: setAuthorizationLink.concat(unauthorizedLink.concat(link)),
    cache: new InMemoryCache(),
  });
