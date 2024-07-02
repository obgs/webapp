"use client";

import {
  BarPlot,
  BarSeriesType,
  ChartsAxisHighlight,
  ChartsLegend,
  ChartsTooltip,
  HighlightItemData,
  ResponsiveChartContainer,
} from "@mui/x-charts";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { useEffect, useMemo, useState } from "react";

import {
  MatchFieldsFragment,
  StatDescriptionStatType,
} from "graphql/generated";
import { byOrderNumber } from "modules/stats/utils";

interface Props {
  match: MatchFieldsFragment;
  highlightedPlayer: string;
}

const isNumericStat = (s: StatDescriptionStatType) =>
  [StatDescriptionStatType.Numeric, StatDescriptionStatType.Aggregate].includes(
    s
  );

const MatchScoreDistributionBarChart = ({
  match,
  highlightedPlayer,
}: Props) => {
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

  const xAxisData = useMemo(
    () =>
      statDescriptions
        .filter((s) => isNumericStat(s.type))
        .map((stat) => stat.name),
    [statDescriptions]
  );

  const series = useMemo(
    () =>
      match.players.map(
        (player): BarSeriesType => ({
          data: statDescriptions
            .filter((s) => isNumericStat(s.type))
            .map((stat) => Number(statsByPlayer?.[player.id]?.[stat.id]) || 0),
          type: "bar",
          id: player.id,
          label: player.name,
          highlightScope: {
            fade: "global",
            highlight: "series",
          },
        })
      ),
    [match.players, statsByPlayer, statDescriptions]
  );
  const [highlighted, setHighlighted] = useState<HighlightItemData>();

  useEffect(() => {
    setHighlighted({
      seriesId: highlightedPlayer,
      dataIndex: match.players.findIndex((p) => p.id === highlightedPlayer),
    });
  }, [highlightedPlayer, match.players]);

  return (
    <ResponsiveChartContainer
      height={500}
      xAxis={[
        {
          data: xAxisData,
          scaleType: "band",
        },
      ]}
      series={series}
      highlightedItem={highlighted}
    >
      <BarPlot barLabel="value" />
      <ChartsLegend direction="row" />
      <ChartsXAxis />
      <ChartsYAxis />
      <ChartsTooltip />
      <ChartsAxisHighlight x="band" />
    </ResponsiveChartContainer>
  );
};

export default MatchScoreDistributionBarChart;
