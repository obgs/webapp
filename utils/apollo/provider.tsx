import { ApolloNextAppProvider } from "@apollo/experimental-nextjs-app-support";
import React, { PropsWithChildren, useCallback } from "react";

import { createClient } from "./server";

const ApolloProvider = ({ children }: PropsWithChildren) => {
  const makeClient = useCallback(() => createClient(), []);
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
};

export default ApolloProvider;
