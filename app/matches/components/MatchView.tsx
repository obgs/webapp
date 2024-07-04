"use client";

import { Divider, Stack, Typography } from "@mui/material";
import React, { useState } from "react";

import MatchPlayerPerformanceComparisonRadarChart from "@/matches/components/MatchPlayerPerformanceComparisonRadarChart";
import MatchScoreDistributionBarChart from "@/matches/components/MatchScoreDistributionBarChart";
import MatchTable from "@/matches/components/MatchTable";
import { MatchFieldsFragment } from "graphql/generated";

interface Props {
  match: MatchFieldsFragment;
}

const MatchView: React.FC<Props> = ({ match }) => {
  const [highlightItem, setHighlightItem] = useState("");
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Charts</Typography>
      <MatchScoreDistributionBarChart
        highlightedPlayer={highlightItem}
        match={match}
      />
      <MatchPlayerPerformanceComparisonRadarChart
        highlightItem={highlightItem}
        match={match}
        onLegendHover={setHighlightItem}
      />
      <Divider />
      <Typography variant="h5">Table</Typography>
      <MatchTable onHover={setHighlightItem} match={match} />
    </Stack>
  );
};

export default MatchView;
