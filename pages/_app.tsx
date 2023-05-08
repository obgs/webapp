import "../styles/globals.css";
import { createTheme, ThemeProvider, useMediaQuery } from "@mui/material";
import type { AppProps } from "next/app";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { SnackbarProvider } from "notistack";
import { useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { AuthProvider } from "modules/auth";
import { Layout } from "modules/nav";
import { ApolloProvider } from "utils/apollo";
import { UserProvider } from "utils/user";

function MyApp({ Component, pageProps }: AppProps) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <SnackbarProvider>
          <AuthProvider>
            <ApolloProvider>
              <UserProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </UserProvider>
            </ApolloProvider>
          </AuthProvider>
        </SnackbarProvider>
      </DndProvider>
    </ThemeProvider>
  );
}

export default MyApp;
