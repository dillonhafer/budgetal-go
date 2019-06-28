import { GetAuthenticationToken } from "@src/utils/authentication";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-link-http";
import Constants from "expo-constants";

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

const link = new HttpLink({
  uri: `${baseURL}/graphql`,
  credentials: "include",
});

export const createApolloClient = () =>
  new ApolloClient({
    link: setAuthorizationLink.concat(link),
    cache: new InMemoryCache(),
  });
