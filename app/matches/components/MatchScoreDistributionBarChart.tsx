"use client";

import { Stack, useTheme } from "@mui/material";
import { blueberryTwilightPalette } from "@mui/x-charts";
import { ChartData, ChartDataset, ChartOptions } from "chart.js/auto";
import { useMemo } from "react";

import ChartjsCanvas from "components/ChartjsCanvas";
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
const getColor = (index: number) =>
  blueberryTwilightPalette("dark")[
    index % blueberryTwilightPalette("dark").length
  ];
const MatchScoreDistributionBarChart = ({ match }: Props) => {
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
  const options: ChartOptions = useMemo(
    () => ({
      responsive: true,
      scales: {
        x: {
          ticks: {
            color: theme.palette.text.primary,
          },
          grid: {
            display: true,
            drawTicks: false,
            color: theme.palette.divider,
          },
        },
        y: {
          ticks: {
            color: theme.palette.text.primary,
          },
          grid: {
            display: true,
            drawTicks: false,
            color: theme.palette.divider,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: theme.palette.text.primary,
          },
        },
      },
    }),
    [theme]
  );

  const data: ChartData<"bar" | "line"> = useMemo(
    () => ({
      labels: statDescriptions.map((stat) => stat.name),
      datasets: [
        ...match.players.map(
          (player, index): ChartDataset<"bar"> => ({
            label: player.name,
            data: statDescriptions.map(
              (stat) => Number(statsByPlayer?.[player.id]?.[stat.id]) || 0
            ),
            backgroundColor: getColor(index),
            type: "bar",
            order: 1,
          })
        ),
        {
          label: "average",
          data: [
            // match.gameVersion.metrics.numericStats[0].globalAverage,
            ...statDescriptions.map(
              (stat) =>
                match.gameVersion.metrics.numericStats.find(
                  (s) => s.stat.id === stat.id
                )?.globalAverage || 0
            ),
            // match.gameVersion.metrics.numericStats.at(-1)?.globalAverage || 0,
          ],
          backgroundColor: getColor(match.players.length),
          type: "line",
          borderColor: getColor(match.players.length),
          order: 0,
          stepped: "middle",
          pointRadius: 0,
        },
      ],
    }),
    [match, statsByPlayer, statDescriptions]
  );

  return (
    <Stack sx={{ width: "100%", height: 500, alignItems: "center" }}>
      <ChartjsCanvas data={data} options={options} />
    </Stack>
  );
};

export default MatchScoreDistributionBarChart;
