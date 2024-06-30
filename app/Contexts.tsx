"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { SnackbarProvider } from "notistack";
import { PropsWithChildren } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { AuthProvider } from "modules/auth";
import { ApolloProvider } from "utils/apollo";
import { UserProvider } from "utils/user";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Contexts: React.FC<PropsWithChildren> = ({ children }) => {
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
