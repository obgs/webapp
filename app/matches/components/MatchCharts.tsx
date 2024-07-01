"use client";

import { Box } from "@mui/material";
import { BarChart, BarSeriesType } from "@mui/x-charts";
import { useMemo } from "react";

import {
  MatchFieldsFragment,
  StatDescriptionStatType,
} from "graphql/generated";
import { byOrderNumber } from "modules/stats/utils";

interface Props {
  match: MatchFieldsFragment;
}

const isNumericStat = (s: StatDescriptionStatType) =>
  [StatDescriptionStatType.Numeric, StatDescriptionStatType.Aggregate].includes(
    s
  );

const MatchCharts = ({ match }: Props) => {
  const statDescriptions = useMemo(
    () => match.gameVersion.statDescriptions.slice().sort(byOrderNumber),
    [match.gameVersion.statDescriptions]
  );

  const statsByPlayer = match?.stats?.reduce((acc, stat) => {
    if (!stat.player) {
      return acc;
    }
    return {
      ...acc,
      [stat.player.id]: {
        ...(acc[stat.player.id] || {}),
        [stat.statDescription.id]: stat.value,
      },
    };
  }, {} as Record<string, Record<string, string>>);

  const xAxisData = statDescriptions
    .filter((s) => isNumericStat(s.type))
    .map((stat) => stat.name);

  const series = match.players.map(
    (player): BarSeriesType => ({
      data: statDescriptions
        .filter((s) => isNumericStat(s.type))
        .map((stat) => Number(statsByPlayer?.[player.id]?.[stat.id]) || 0),
      type: "bar",
      id: player.id,
      label: player.name,
    })
  );
  return (
    <Box width="100%">
      <BarChart
        height={500}
        xAxis={[
          {
            data: xAxisData,
            scaleType: "band",
          },
        ]}
        series={series}
      />
    </Box>
  );
};

export default MatchCharts;
