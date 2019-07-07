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
import { ServerError } from "apollo-link-http-common";
import { error, maintenance } from "@src/notify";

let __baseURL = "https://api.budgetal.com";
if (__DEV__) {
  const expoHost = Constants.manifest.debuggerHost || "";
  const port = "3000";
  __baseURL = "http://" + expoHost.replace(/:\d+/, `:${port}`);
}
export const baseURL = __baseURL;

const setAuthorizationLink = setContext(() => {
  return GetAuthenticationToken().then(token => ({
    headers: { "X-Budgetal-Session": token },
  }));
});

interface IHeaders {
  "content-type"?: string;
}

const multiPartFetch = (uri: string, options: RequestInit) => {
  const body = JSON.parse(String(options.body));
  const multipart =
    Object.keys(body.variables).includes("file") && !!body.variables.file;

  if (multipart) {
    const formData = new FormData();
    formData.append("file", body.variables.file);
    delete body.variables.file;

    if ((options.headers as IHeaders)["content-type"]) {
      delete (options.headers as IHeaders)["content-type"];
    }

    formData.append("operationName", body.operationName);
    formData.append("query", body.query);
    formData.append("variables", JSON.stringify(body.variables));
    options.body = formData;
  }

  return fetch(uri, options);
};

const unauthorizedLink = onError(({ networkError }) => {
  if (networkError && (networkError as ServerError).statusCode === 503) {
    maintenance("We are performing scheduled maintenance right now.", 15000);
  }

  if (networkError && (networkError as ServerError).statusCode === 200) {
    error("Something went wrong.", 5000);
  }

  if (networkError && (networkError as ServerError).statusCode === 401) {
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
  fetch: multiPartFetch,
});

export const createApolloClient = () =>
  new ApolloClient({
    link: setAuthorizationLink.concat(unauthorizedLink.concat(link)),
    cache: new InMemoryCache(),
  });
