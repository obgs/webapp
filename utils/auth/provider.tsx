import { useRouter } from "next/router";
import { PropsWithChildren, useCallback, useState } from "react";
import storage from "../storage";
import client from "./client";
import AuthContext from "./context";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  const router = useRouter();

  const saveTokens = useCallback(
    (access_token: string, refresh_token: string) => {
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      storage.saveTokens({
        accessToken: access_token,
        refreshToken: refresh_token,
      });
      setAuthenticated(true);
    },
    []
  );

  const signin = useCallback(
    async (email: string, password: string) => {
      const { access_token, refresh_token } = await client.signIn(
        email,
        password
      );
      saveTokens(access_token, refresh_token);
      router.push("/");
    },
    [saveTokens, router]
  );

  const signup = useCallback(
    async (email: string, password: string) => {
      const { access_token, refresh_token } = await client.signUp(
        email,
        password
      );
      saveTokens(access_token, refresh_token);
      router.push("/");
    },
    [router, saveTokens]
  );

  const signout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    storage.clean();
    setAuthenticated(false);
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        signin,
        signup,
        signout,
        accessToken,
        refreshToken,
        authenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
