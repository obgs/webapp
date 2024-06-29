import { ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { errorLink, httpLink } from "./links";
import typePolicies from "./typePolicies";
import result from "graphql/introspection-result";

export const createClient = (accessToken: string | null) => {
  const authLink = setContext(async () =>
    accessToken
      ? {
          headers: {
            Authorization: accessToken,
          },
        }
      : undefined
  );

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
    link: authLink.concat(errorLink).concat(httpLink),
  });
};
