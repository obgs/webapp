import {
  CircularProgress,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";

import { StatDescriptionStatType, useMatchQuery } from "graphql/generated";
import { useSnackbarError } from "utils/apollo";

type Order = "asc" | "desc";

const Match: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, loading, error } = useMatchQuery({
    skip: !id || typeof id !== "string",
    variables: {
      id: id as string,
    },
  });
  useSnackbarError(error);

  const match = useMemo(
    () => (data?.node?.__typename === "Match" ? data.node : null),
    [data]
  );

  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState(
    match?.game.statDescriptions[0].id || ""
  );

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
      const statType = match?.game.statDescriptions.find(
        (s) => s.id === orderBy
      )?.type;

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
  }, [match, order, orderBy]);

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

  if (loading || !match) {
    return (
      <Stack flex={1} alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Container>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Player</TableCell>
            {match.game.statDescriptions.map((stat) => (
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
                  {match.game.statDescriptions.map((stat) => (
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

export default Match;
