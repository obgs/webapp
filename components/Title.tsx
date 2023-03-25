import Head from "next/head";
import React, { PropsWithChildren } from "react";

interface Props {
  text: string;
}

const Title: React.FC<PropsWithChildren<Props>> = ({ text, children }) => {
  return (
    <>
      <Head>
        <title>OBGS | {text}</title>
      </Head>
      {children}
    </>
  );
};

export default Title;
