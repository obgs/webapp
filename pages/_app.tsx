import "../styles/globals.css";
import type { AppProps } from "next/app";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createTheme, ThemeProvider } from "@mui/material";
import Layout from "../components/Layout";
import AuthProvider from "../utils/auth/provider";
import ApolloProvider from "../utils/apollo/provider";

const theme = createTheme();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <ApolloProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ApolloProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
