import { useTheme } from "@mui/material";
import { blueberryTwilightPalette } from "@mui/x-charts";
import React, { useMemo } from "react";
import {
  RadarChart,
  PolarGrid,
  Legend,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
  Radar,
  PolarRadiusAxis,
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
  [StatDescriptionStatType.Numeric].includes(s);

const MatchPlayerPerformanceComparisonRadarChart = ({
  match,
  highlightedPlayer,
}: Props) => {
  const theme = useTheme();
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

  const data = statDescriptions.map((stat, index) => ({
    stat: stat.name,
    ...match.players.reduce(
      (acc, player) => ({
        ...acc,
        [player.id]: Number(statsByPlayer?.[player.id]?.[stat.id]) || 0,
      }),
      {}
    ),
    average:
      match.gameVersion.metrics.numericStats[index].globalAverage.toFixed(2),
  }));
  return (
    <ResponsiveContainer height={500} width="50%">
      <RadarChart data={data}>
        <Tooltip
          content={(props) => <RechartsTooltip {...props} payloadKey="stat" />}
        />
        <PolarGrid />
        <PolarAngleAxis
          dataKey="stat"
          tickSize={15}
          tick={{ fill: theme.palette.text.primary }}
        />
        <PolarRadiusAxis angle={180 / statDescriptions.length} />
        {match.players.map((player, index) => (
          <Radar
            key={player.id}
            name={player.name}
            dataKey={player.id}
            stroke={getColor(index)}
            fill={getColor(index)}
            fillOpacity={highlightedPlayer === player.id ? 0.6 : 0.1}
          />
        ))}
        <Radar
          name="Average"
          dataKey="average"
          stroke={getColor(match.players.length)}
          fill={getColor(match.players.length)}
          fillOpacity={0.5}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default MatchPlayerPerformanceComparisonRadarChart;
