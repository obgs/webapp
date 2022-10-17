import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useMemo } from "react";
import { usePendingSupervisionRequestsQuery } from "../../graphql/generated";
import useSnackbarError from "../../utils/apollo/useSnackbarError";

const OutgoingSupervisionRequests = () => {
  const { data, error, loading } = usePendingSupervisionRequestsQuery();
  useSnackbarError(error);

  const requests = useMemo(() => data?.me.sentSupervisionRequests, [data]);

  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Player ID</TableCell>
                <TableCell>Player Name</TableCell>
                <TableCell>Approvals</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!requests?.length && (
                <TableRow>
                  <TableCell colSpan={3}>No requests</TableCell>
                </TableRow>
              )}
              {requests?.map((request) => {
                if (!request) return;
                const total = request?.approvals?.length;
                const approved = request.approvals?.filter((a) =>
                  Boolean(a.approved)
                ).length;
                return (
                  <TableRow key={request.player.id}>
                    <TableCell>{request.player.id}</TableCell>
                    <TableCell>{request.player.name}</TableCell>
                    <TableCell>
                      {approved}/{total}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default OutgoingSupervisionRequests;
