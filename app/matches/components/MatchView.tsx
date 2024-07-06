"use client";

import { Divider, Stack, Typography } from "@mui/material";
import React from "react";

import MatchPlayerPerformanceComparisonRadarChart from "@/matches/components/MatchPlayerPerformanceComparisonRadarChart";
import MatchScoreDistributionBarChart from "@/matches/components/MatchScoreDistributionBarChart";
import MatchTable from "@/matches/components/MatchTable";
import { MatchFieldsFragment } from "graphql/generated";

interface Props {
  match: MatchFieldsFragment;
}

const MatchView: React.FC<Props> = ({ match }) => {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Charts</Typography>
      <MatchScoreDistributionBarChart match={match} />
      <MatchPlayerPerformanceComparisonRadarChart match={match} />
      <Divider />
      <Typography variant="h5">Table</Typography>
      <MatchTable match={match} />
    </Stack>
  );
};

export default MatchView;
