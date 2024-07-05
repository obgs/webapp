import { alpha, Stack, useTheme } from "@mui/material";
import { blueberryTwilightPalette } from "@mui/x-charts";
import {
  ChartOptions,
  ChartData,
  ChartDataset,
  LegendItem,
} from "chart.js/auto";
import React, { useMemo } from "react";

import ChartjsCanvas from "components/ChartjsCanvas";
import {
  MatchFieldsFragment,
  StatDescriptionStatType,
} from "graphql/generated";
import { byOrderNumber } from "modules/stats/utils";

interface Props {
  match: MatchFieldsFragment;
}

const getColor = (index: number) =>
  blueberryTwilightPalette("dark")[
    index % blueberryTwilightPalette("dark").length
  ];

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

  const data: ChartData<"radar"> = useMemo(
    () => ({
      labels: statDescriptions.map((s) => s.name),
      datasets: [
        ...match.players.map(
          (player, index): ChartDataset<"radar"> => ({
            label: player.name,
            data: statDescriptions.map(
              (stat) => Number(statsByPlayer?.[player.id]?.[stat.id]) || 0
            ),
            backgroundColor: alpha(getColor(index), 0.6),
            type: "radar",
            pointRadius: 3,
          })
        ),
        {
          label: "average",
          data: statDescriptions.map(
            (stat) =>
              match.gameVersion.metrics.numericStats.find(
                (s) => s.stat.id === stat.id
              )?.globalAverage || 0
          ),
          backgroundColor: alpha(getColor(match.players.length), 0.6),
          type: "radar",
          pointRadius: 3,
        },
      ],
    }),
    [
      match.gameVersion.metrics.numericStats,
      match.players,
      statDescriptions,
      statsByPlayer,
    ]
  );
  const options: ChartOptions<"radar"> = useMemo(
    () => ({
      responsive: true,
      scales: {
        r: {
          pointLabels: {
            color: theme.palette.text.primary,
          },
          angleLines: {
            color: theme.palette.divider,
          },
          ticks: {
            color: theme.palette.text.primary,
            backdropColor: theme.palette.background.default,
          },
          grid: {
            color: theme.palette.divider,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: theme.palette.text.primary,
            generateLabels: (chart) => {
              return chart.data.datasets.map(
                (dataset, i): LegendItem => ({
                  text: dataset.label || "",
                  fontColor: theme.palette.text.primary,
                  fillStyle: getColor(i),
                  datasetIndex: i,
                })
              );
            },
          },
        },
      },
    }),
    [theme]
  );
  return (
    <Stack alignItems="center" height={500} width="100%">
      <ChartjsCanvas type="radar" data={data} options={options} />
    </Stack>
  );
};

export default MatchPlayerPerformanceComparisonRadarChart;
