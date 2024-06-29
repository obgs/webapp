"use client";

import { CircularProgress, Stack } from "@mui/material";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";

import MatchView from "@/matches/components/MatchView";
import { useMatchQuery } from "graphql/generated";
import { useSnackbarError } from "utils/apollo";

const Match: React.FC = () => {
  const { id } = useParams() || {};

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

  return <MatchView match={match} />;
};

export default Match;
