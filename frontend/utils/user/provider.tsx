import { PropsWithChildren } from "react";

import { UserContext } from "./context";
import { useMeQuery } from "graphql/generated";
import { useAuth } from "modules/auth";

const UserProvider = ({ children }: PropsWithChildren) => {
  const { authenticated } = useAuth();
  const { data, loading } = useMeQuery({
    skip: !authenticated,
    fetchPolicy: "network-only",
  });

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
