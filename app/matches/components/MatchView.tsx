"use client";

import { Divider, Stack, Typography } from "@mui/material";
import React, { useState } from "react";

import MatchCharts from "@/matches/components/MatchCharts";
import MatchTable from "@/matches/components/MatchTable";
import { MatchFieldsFragment } from "graphql/generated";

interface Props {
  match: MatchFieldsFragment;
}

const MatchView: React.FC<Props> = ({ match }) => {
  const [highlightedPlayer, setHighlightedPlayer] = useState("");
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Charts</Typography>
      <MatchCharts highlightedPlayer={highlightedPlayer} match={match} />
      <Divider />
      <Typography variant="h5">Table</Typography>
      <MatchTable onHover={setHighlightedPlayer} match={match} />
    </Stack>
  );
};

export default MatchView;
