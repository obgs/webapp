import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useCallback, useMemo } from "react";

import {
  useGroupApplicationsQuery,
  useResolveGroupMembershipApplicationMutation,
  UserFieldsFragment,
} from "../../../graphql/generated";
import useSnackbarError from "../../../utils/apollo/useSnackbarError";

interface Props {
  groupId: string;
}

const GroupApplications: React.FC<Props> = ({ groupId }) => {
  const { data, error, loading } = useGroupApplicationsQuery({
    variables: {
      id: groupId,
    },
  });
  useSnackbarError(error);

  const [resolve, { loading: resolveLoading, error: resolveError }] =
    useResolveGroupMembershipApplicationMutation();
  useSnackbarError(resolveError);
  // we want to show the loading button only for the related row
  const [resolvingIndex, setResolvingIndex] = React.useState<number | null>(
    null
  );

  const { enqueueSnackbar } = useSnackbar();
  const onResolve = useCallback(
    (
        index: number,
        user: UserFieldsFragment,
        applicationId: string,
        accepted: boolean
      ) =>
      async () => {
        setResolvingIndex(index);
        await resolve({
          variables: {
            applicationId,
            accepted,
          },
          update: (cache) => {
            cache.evict({ id: `GroupMembershipApplication:${applicationId}` });
          },
        });
        setResolvingIndex(null);
        enqueueSnackbar(
          `User ${user.name || user.id} ${accepted ? "accepted" : "rejected"}.`,
          { variant: "success" }
        );
      },
    [enqueueSnackbar, resolve]
  );

  const applications = useMemo(
    () =>
      data?.node?.__typename === "Group" ? data?.node?.applications : undefined,
    [data?.node]
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>User</TableCell>
          <TableCell>Message</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {!applications?.length ? (
          <TableRow>
            <TableCell colSpan={3}>No applications</TableCell>
          </TableRow>
        ) : (
          applications.map((application, i) => (
            <TableRow hover key={application.id}>
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar src={application.user.avatarURL} />
                  <Typography>
                    {application.user.name || application.user.id}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>{application.message || "-"}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <LoadingButton
                    loading={i === resolvingIndex && resolveLoading}
                    color="error"
                    onClick={onResolve(
                      i,
                      application.user,
                      application.id,
                      false
                    )}
                  >
                    Reject
                  </LoadingButton>
                  <LoadingButton
                    loading={i === resolvingIndex && resolveLoading}
                    color="success"
                    onClick={onResolve(
                      i,
                      application.user,
                      application.id,
                      true
                    )}
                  >
                    Accept
                  </LoadingButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default GroupApplications;
