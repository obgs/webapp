import { createContext } from "react";
import { User } from "../../graphql/generated";

interface UserContext {
  user: User | null;
  loading: boolean;
}

export const UserContext = createContext<UserContext>({
  user: null,
  loading: true,
});
