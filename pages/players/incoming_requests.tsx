import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import {
  PlayerSupervisionRequestFieldsFragment,
  useIncomingSupervisionRequestsQuery,
} from "../../graphql/generated";
import ResolvePlayerSupervisionRequestModal from "./ResolveSupervisionRequestModal";

const IncomingSupervisionRequests = () => {
  const { data, loading, error } = useIncomingSupervisionRequestsQuery();

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
        <ResolvePlayerSupervisionRequestModal
          open={resolveModalOpen}
          onClose={() => setResolveModalOpen(false)}
          request={selectedRequest}
        />
      )}
      {error && (
        <Snackbar>
          <Alert severity="error">
            {error.message || "Something went wrong"}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default IncomingSupervisionRequests;
