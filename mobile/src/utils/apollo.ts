import Constants from "expo-constants";
import { GetAuthenticationToken } from "@src/utils/authentication";

import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloLink } from "apollo-link";
import { HttpLink, createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";

let __baseURL = "https://api.budgetal.com";
if (__DEV__) {
  const expoHost = Constants.manifest.debuggerHost || "";
  const port = "3000";
  __baseURL = "http://" + expoHost.replace(/:\d+/, `:${port}`);
}
export const baseURL = __baseURL;

const setAuthorizationLink = setContext(async (request, previousContext) => {
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
