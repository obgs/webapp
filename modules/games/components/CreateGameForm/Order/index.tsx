import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

import { FormValues } from "..";
import OrderItem from "./OrderItem";
import { StatItem } from "./StatItem";
import { StatDescriptionStatType } from "graphql/generated";

interface Props {
  values: FormValues;
  goBack: () => void;
  onConfirm: (values: Record<string, number>) => void;
}

const Order: React.FC<Props> = ({ values, goBack, onConfirm }) => {
  const [stats, setStats] = useState<StatItem[]>(
    [
      ...values.genericStats.map((stat) => ({
        name: stat.name,
        id: stat.id,
        index: stat.orderNumber,
        type: "stat",
        statType: stat.type,
        details:
          stat.type === StatDescriptionStatType.Enum ? (
            <Stack spacing={2}>
              {stat.description && (
                <Typography variant="body2">{stat.description}</Typography>
              )}
              <Typography variant="body2">Possible values:</Typography>
              <Stack direction="row" spacing={2}>
                {stat.possibleValues.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Stack>
            </Stack>
          ) : (
            <Typography variant="body2">{stat.description}</Typography>
          ),
      })),
      ...values.aggregateStats.map((stat) => ({
        name: stat.name,
        id: stat.id,
        index: stat.orderNumber,
        type: "stat",
        statType: StatDescriptionStatType.Aggregate,
        details: (
          <>
            {stat.description && (
              <Typography variant="body2">{stat.description}</Typography>
            )}
            <Stack alignItems="center" direction="row" spacing={1}>
              {stat.references.map((referredStat, i) => (
                <>
                  <Chip
                    label={
                      // find the referenced stats by id
                      values.genericStats.find(
                        (genericStat) => genericStat.id === referredStat
                      )?.name
                    }
                  />
                  {i < stat.references.length - 1 && <Typography>+</Typography>}
                </>
              ))}
            </Stack>
          </>
        ),
      })),
    ].sort((a, b) => a.index - b.index)
  );

  // on the first render, we assign the a proper order number to the stats
  useEffect(() => {
    setStats((prevStats) =>
      prevStats.map(
        (stat, i): StatItem =>
          stat.index
            ? stat
            : {
                ...stat,
                index: i,
              }
      )
    );
  }, []);

  const swapStats = useCallback(
    (index1: number, index2: number) => {
      setStats((prevStats) => {
        const newStats = [...prevStats];
        const temp = newStats[index1];
        temp.index = index2;
        newStats[index2].index = index1;
        newStats[index1] = newStats[index2];
        newStats[index2] = temp;
        return newStats;
      });
    },
    [setStats]
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Stat order</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          The stats in a match will be ordered by the order you set here. You
          can drag and drop the stats to change their order.
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {stats.length &&
          stats.map((stat, i) => (
            <OrderItem
              key={stat.id}
              index={i}
              stat={stat}
              moveStat={swapStats}
            />
          ))}
      </CardContent>

      <CardActions>
        <Button variant="outlined" onClick={goBack}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            onConfirm(
              stats.reduce(
                (acc, curr) => ({
                  ...acc,
                  [curr.id]: curr.index,
                }),
                {}
              )
            )
          }
        >
          Continue
        </Button>
      </CardActions>
    </Card>
  );
};

export default Order;
