import { registerApolloClient } from "@apollo/experimental-nextjs-app-support";

import { createClient } from "utils/apollo/client";

export const { getClient, query, PreloadQuery } =
  registerApolloClient(createClient);
