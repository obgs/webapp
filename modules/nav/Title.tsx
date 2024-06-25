import Head from "next/head";
import React from "react";

interface Props {
  text: string;
}

export const Title: React.FC<Props> = ({ text }) => {
  return (
    <Head>
      <title>{`OBGS | ${text}`}</title>
    </Head>
  );
};
