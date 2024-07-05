"use client";

import { useTheme } from "@mui/material";
import { blueberryTwilightPalette } from "@mui/x-charts";
import { useMemo } from "react";
import {
  Bar,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import RechartsTooltip from "@/matches/components/RechartsTooltip";
import {
  MatchFieldsFragment,
  StatDescriptionStatType,
} from "graphql/generated";
import { byOrderNumber } from "modules/stats/utils";

interface Props {
  match: MatchFieldsFragment;
  highlightedPlayer: string;
}

const getColor = (index: number) =>
  blueberryTwilightPalette("dark")[
    index % blueberryTwilightPalette("dark").length
  ];

const isNumericStat = (s: StatDescriptionStatType) =>
  [StatDescriptionStatType.Numeric, StatDescriptionStatType.Aggregate].includes(
    s
  );

const MatchScoreDistributionBarChart = ({
  match,
  highlightedPlayer,
}: Props) => {
  const statDescriptions = useMemo(
    () =>
      match.gameVersion.statDescriptions
        .slice()
        .filter((s) => isNumericStat(s.type))
        // filter out the highest stat
        .slice(0, -1)
        .sort(byOrderNumber),
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
  const theme = useTheme();

  const data = useMemo(
    () =>
      statDescriptions.map((stat) => ({
        name: stat.name,
        ...match.players.reduce(
          (acc, player) => ({
            ...acc,
            [player.id]: Number(statsByPlayer?.[player.id]?.[stat.id]) ?? 0,
          }),
          {}
        ),
      })),
    [match.players, statDescriptions, statsByPlayer]
  );

  return (
    <ResponsiveContainer height={500}>
      <ComposedChart data={data}>
        {match.players.map((player, index) => (
          <Bar
            activeBar
            key={player.id}
            dataKey={player.id}
            fill={getColor(index)}
          />
        ))}
        <XAxis dataKey="name" />
        <YAxis />
        <Legend
          formatter={(value) => match.players.find((p) => p.id === value)?.name}
        />
        <Tooltip
          cursor={false}
          content={(props) => <RechartsTooltip {...props} payloadKey="name" />}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default MatchScoreDistributionBarChart;
