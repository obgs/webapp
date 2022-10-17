import { createContext } from "react";

import { UserFieldsFragment } from "../../graphql/generated";

interface UserContext {
  user: UserFieldsFragment | null;
  loading: boolean;
}

export const UserContext = createContext<UserContext>({
  user: null,
  loading: true,
});
