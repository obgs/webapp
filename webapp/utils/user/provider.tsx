import { PropsWithChildren } from "react";

import { useMeQuery } from "../../graphql/generated";
import useAuth from "../auth/useAuth";
import { UserContext } from "./context";

const UserProvider = ({ children }: PropsWithChildren) => {
  const { authenticated } = useAuth();
  const { data, loading } = useMeQuery({ skip: !authenticated });

  return (
    <UserContext.Provider
      value={{
        loading,
        user: data?.me || null,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
