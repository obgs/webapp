import { GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/router";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";

import client from "./client";
import AuthContext from "./context";
import storage from "modules/storage";

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

  const googleSignin = useCallback(
    async (token: string) => {
      const { access_token, refresh_token } = await client.googleSignin(token);
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

  const googleClientID = process.env.NEXT_PUBLIC_OAUTH_GOOGLE_CLIENT_ID || "";

  useEffect(() => {
    const tokens = storage.loadTokens();
    if (tokens) {
      setAccessToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);
      setAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signin,
        signup,
        signout,
        googleSignin,
        accessToken,
        refreshToken,
        authenticated,
      }}
    >
      <GoogleOAuthProvider clientId={googleClientID}>
        {children}
      </GoogleOAuthProvider>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
