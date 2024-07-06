import { useECharts } from "@kbox-labs/react-echarts";
import { useTheme } from "@mui/material";
import React, { useMemo } from "react";

import { color } from "@/charts/colors";
import {
  MatchFieldsFragment,
  StatDescriptionStatType,
} from "graphql/generated";
import { byOrderNumber } from "modules/stats/utils";

interface Props {
  match: MatchFieldsFragment;
}

const isNumericStat = (s: StatDescriptionStatType) =>
  [StatDescriptionStatType.Numeric].includes(s);

const MatchPlayerPerformanceComparisonRadarChart = ({ match }: Props) => {
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

  const [ref] = useECharts<HTMLDivElement>({
    color,
    title: {
      text: "Player Performance Comparison",
      textStyle: {
        color: theme.palette.text.primary,
        fontWeight: 400,
        minMargin: 10,
      },
    },
    legend: {
      data: [...match.players.map((player) => player.name), "Global average"],
      textStyle: {
        color: theme.palette.text.primary,
      },
      bottom: 0,
    },
    radar: {
      indicator: statDescriptions.map((stat) => ({
        name: stat.name,
      })),
      splitArea: {
        areaStyle: {
          color: [theme.palette.background.default],
        },
      },
      splitNumber: 4,
    },
    series: [
      {
        type: "radar",
        name: "Player Performance",
        areaStyle: { opacity: 0.5 },
        emphasis: { areaStyle: { opacity: 1 } },
        data: [
          ...match.players.map((player) => ({
            name: player.name,
            value: statDescriptions.map((stat) =>
              Number(statsByPlayer?.[player.id]?.[stat.id])
            ),
            symbol: "none",
          })),
          {
            name: "Global average",
            value: match.gameVersion.metrics.numericStats.map((stat) =>
              stat.globalAverage.toFixed(2)
            ),
            symbol: "none",
          },
        ],
      },
    ],
    tooltip: {
      backgroundColor: theme.palette.background.paper,
      borderWidth: 0,
      textStyle: {
        color: theme.palette.text.primary,
      },
    },
  });

  return <div ref={ref} style={{ height: 400, width: "50%" }} />;
};

export default MatchPlayerPerformanceComparisonRadarChart;
