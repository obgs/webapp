import { PropsWithChildren } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "../styles/globals.css";

import Contexts from "./Contexts";
import { Layout } from "modules/nav";

const RootLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Contexts>
          <Layout>{children}</Layout>
        </Contexts>
      </body>
    </html>
  );
};

export default RootLayout;
