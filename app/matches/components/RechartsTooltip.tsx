import {
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

const RechartsTooltip: React.FC<
  TooltipProps<ValueType, NameType> & { payloadKey: string }
> = ({ payload, payloadKey }) => {
  const theme = useTheme();
  if (!payload || !payload.length) {
    return null;
  }
  return (
    <Paper>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={3}>
              <Typography sx={{ fontWeight: 400, opacity: 0.7 }}>
                {payload[0].payload?.[payloadKey]}
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payload.map((entry) => (
            <TableRow
              sx={{
                [`& .${tableCellClasses.root}`]: {
                  borderBottom: "none",
                  paddingY: 0,
                },
                "tr:first-of-type& td": {
                  paddingTop: theme.spacing(1),
                },
                "tr:last-of-type& td": {
                  paddingBottom: theme.spacing(1),
                },
                verticalAlign: "middle",
                color: theme.palette.text.secondary,
              }}
              key={entry.dataKey}
            >
              <TableCell
                sx={{
                  paddingLeft: theme.spacing(2),
                  paddingRight: 0,
                }}
              >
                <div
                  style={{
                    width: theme.spacing(1),
                    height: theme.spacing(1),
                    backgroundColor: entry.color,
                    borderRadius: "50%",
                  }}
                />
              </TableCell>
              <TableCell
                sx={{
                  paddingLeft: theme.spacing(1),
                  paddingRight: 0,
                }}
              >
                <Typography sx={{ fontWeight: 400, opacity: 0.7 }}>
                  {entry.name}
                </Typography>
              </TableCell>
              <TableCell
                sx={{
                  paddingLeft: theme.spacing(4),
                  color: theme.palette.text.primary,
                }}
              >
                <Typography fontSize={16}>{entry.value}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default RechartsTooltip;
