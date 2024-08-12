"use client";

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
import React, { useCallback, useMemo, useState } from "react";

import ResolveSupervisionRequestModal from "@/players/components/ResolveSupervisionRequestModal";
import {
  PlayerSupervisionRequestFieldsFragment,
  useIncomingSupervisionRequestsQuery,
} from "graphql/generated";
import { useSnackbarError } from "utils/apollo";

const IncomingSupervisionRequests = () => {
  const { data, loading, error } = useIncomingSupervisionRequestsQuery();
  useSnackbarError(error);

  const requests = useMemo(
    () => data?.me.receivedSupervisionRequests,
    [data?.me.receivedSupervisionRequests]
  );

  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<PlayerSupervisionRequestFieldsFragment>();

  const resolveRequest = useCallback(
    (request: PlayerSupervisionRequestFieldsFragment) => () => {
      setSelectedRequest(request);
      setResolveModalOpen(true);
    },
    []
  );

  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Player name</TableCell>
                <TableCell>Player ID</TableCell>
                <TableCell>User</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!requests?.length && (
                <TableRow>
                  <TableCell colSpan={3}>No requests</TableCell>
                </TableRow>
              )}
              {requests?.map((request) => (
                <TableRow
                  key={request.id}
                  hover
                  onClick={resolveRequest(request)}
                  data-cy="playerIncTest"
                >
                  <TableCell>{request.player.name}</TableCell>
                  <TableCell>{request.player.id}</TableCell>
                  <TableCell>
                    {request.sender.name || request.sender.id}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
      {selectedRequest && (
        <ResolveSupervisionRequestModal
          open={resolveModalOpen}
          onClose={() => setResolveModalOpen(false)}
          request={selectedRequest}
        />
      )}
    </Box>
  );
};

export default IncomingSupervisionRequests;
