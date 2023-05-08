import { CircularProgress, Stack } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

import MatchView from "./components/MatchView";
import { useMatchQuery } from "graphql/generated";
import { useSnackbarError } from "utils/apollo";

const Match: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, loading, error } = useMatchQuery({
    skip: !id || typeof id !== "string",
    variables: {
      id: id as string,
    },
  });
  useSnackbarError(error);

  const match = useMemo(
    () => (data?.node?.__typename === "Match" ? data.node : null),
    [data]
  );

  if (loading || !match) {
    return (
      <Stack flex={1} alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <>
      <Head>
        <title>OBGS | Match {match.id}</title>
      </Head>
      <MatchView match={match} />
    </>
  );
};

export default Match;
