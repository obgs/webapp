"use client";

import { useMediaQuery } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { SnackbarProvider } from "notistack";
import { PropsWithChildren, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { AuthProvider } from "modules/auth";
import { ApolloProvider } from "utils/apollo";
import { UserProvider } from "utils/user";

const Contexts: React.FC<PropsWithChildren> = ({ children }) => {
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
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <DndProvider backend={HTML5Backend}>
          <AuthProvider>
            <ApolloProvider>
              <UserProvider>
                <SnackbarProvider>{children}</SnackbarProvider>
              </UserProvider>
            </ApolloProvider>
          </AuthProvider>
        </DndProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default Contexts;
