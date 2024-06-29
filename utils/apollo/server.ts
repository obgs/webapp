import { setContext } from "@apollo/client/link/context";
import {
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";

import { errorLink, httpLink } from "./links";
import typePolicies from "./typePolicies";
import result from "graphql/introspection-result";
import { loadTokens } from "modules/auth/tokens";

export const createClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache({
      possibleTypes: result.possibleTypes,
      typePolicies,
    }),
    defaultOptions: {
      watchQuery: {
        errorPolicy: "all",
      },
    },
    link: setContext(async () => {
      const { accessToken } = (await loadTokens()) || {};
      return accessToken
        ? {
            headers: {
              Authorization: accessToken,
            },
          }
        : undefined;
    })
      .concat(errorLink)
      .concat(httpLink),
  });
};
