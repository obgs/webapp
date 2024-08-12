"use client";

import { useECharts } from "@kbox-labs/react-echarts";
import { useTheme } from "@mui/material";
import { BarSeriesOption } from "echarts";
import { useMemo } from "react";

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
  [StatDescriptionStatType.Numeric, StatDescriptionStatType.Aggregate].includes(
    s
  );

const MatchScoreDistributionBarChart = ({ match }: Props) => {
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
    renderer: "svg",
    legend: {
      data: [...match.players.map((player) => player.name)],
      textStyle: {
        color: theme.palette.text.primary,
      },
    },
    xAxis: {
      type: "category",
      data: statDescriptions.map((stat) => stat.name),
      axisLabel: {
        color: theme.palette.text.primary,
        interval: 0,
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: theme.palette.text.primary,
      },
      axisLine: {
        lineStyle: {
          color: theme.palette.divider,
          width: 1,
          opacity: 1,
        },
        symbol: ["none", "arrow"],
        symbolOffset: [0, 10],
        show: true,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: theme.palette.divider,
          width: 1,
          type: "dashed",
        },
      },
    },
    series: match.players.map(
      (player): BarSeriesOption => ({
        name: player.name,
        data: statDescriptions.map((stat) =>
          Number(statsByPlayer?.[player.id]?.[stat.id])
        ),
        type: "bar",
        emphasis: {
          focus: "series",
        },
      })
    ),
    tooltip: {
      trigger: "item",
      backgroundColor: theme.palette.background.paper,
      borderWidth: 0,
      textStyle: {
        color: theme.palette.text.primary,
      },
    },
    title: {
      text: "Score Distribution",
      textStyle: {
        color: theme.palette.text.primary,
        fontWeight: 400,
      },
    },
    animation: true,
  });

  return <div ref={ref} style={{ height: 400, width: "100%" }} />;
};

export default MatchScoreDistributionBarChart;
