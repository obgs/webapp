import { ApolloNextAppProvider } from "@apollo/experimental-nextjs-app-support";
import React, { PropsWithChildren } from "react";

import { createClient } from "utils/apollo/client";

const ApolloProvider = ({ children }: PropsWithChildren) => {
  return (
    <ApolloNextAppProvider makeClient={createClient}>
      {children}
    </ApolloNextAppProvider>
  );
};

export default ApolloProvider;
