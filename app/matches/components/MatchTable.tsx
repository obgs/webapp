"use client";

import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";

import {
  MatchFieldsFragment,
  StatDescriptionStatType,
} from "graphql/generated";
import { byOrderNumber } from "modules/stats/utils";

type Order = "asc" | "desc";

interface Props {
  match: MatchFieldsFragment;
}

const MatchTable: React.FC<Props> = ({ match }) => {
  const [order, setOrder] = useState<Order>("desc");
  const statDescriptions = useMemo(
    () => match.gameVersion.statDescriptions.slice().sort(byOrderNumber),
    [match.gameVersion.statDescriptions]
  );
  const [orderBy, setOrderBy] = useState(statDescriptions[0].id || "");

  const sortedStats = useMemo(() => {
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
    return Object.entries(statsByPlayer || {}).sort((a, b) => {
      const statType = statDescriptions.find((s) => s.id === orderBy)?.type;

      const aStat =
        statType === StatDescriptionStatType.Numeric
          ? Number(a[1][orderBy])
          : a[1][orderBy];
      const bStat =
        statType === StatDescriptionStatType.Numeric
          ? Number(b[1][orderBy])
          : b[1][orderBy];
      if (aStat === bStat) {
        return 0;
      }
      if (order === "asc") {
        return aStat < bStat ? -1 : 1;
      }
      return aStat > bStat ? -1 : 1;
    });
  }, [match?.stats, statDescriptions, orderBy, order]);

  const handleSort = useCallback(
    (fieldId: string) => {
      if (fieldId === orderBy) {
        setOrder(order === "asc" ? "desc" : "asc");
      } else {
        setOrder("desc");
        setOrderBy(fieldId);
      }
    },
    [order, orderBy]
  );

  return (
    <Container>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Player</TableCell>
            {statDescriptions.map((stat) => (
              <TableCell key={stat.id}>
                <TableSortLabel
                  active={orderBy === stat.id}
                  direction={orderBy === stat.id ? order : "desc"}
                  onClick={() => handleSort(stat.id)}
                >
                  {stat.name}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedStats.map(
            ([playerId, stats]: [string, Record<string, string>]) => {
              const player = match.players.find((p) => p.id === playerId);

              return (
                <TableRow key={playerId}>
                  <TableCell>{player?.name || player?.owner?.name}</TableCell>
                  {statDescriptions.map((stat) => (
                    <TableCell key={stat.id}>{stats[stat.id]}</TableCell>
                  ))}
                </TableRow>
              );
            }
          )}
        </TableBody>
      </Table>
    </Container>
  );
};

export default MatchTable;
