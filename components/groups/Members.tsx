import {
  Avatar,
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useCallback, useMemo } from "react";

import {
  GroupMembershipFieldsFragment,
  GroupMembershipFieldsFragmentDoc,
  GroupMembershipRole,
  PageInfoFieldsFragment,
  useChangeUserGroupMembershipRoleMutation,
  useGroupMembersLazyQuery,
} from "../../graphql/generated";
import useSnackbarError from "../../utils/apollo/useSnackbarError";
import groupRoles from "../../utils/groupRoles";
import useGroupMembersPagination from "./useGroupMembersPagination";

interface Props {
  groupId: string;
  manage?: boolean;
}

const Members: React.FC<Props> = ({ groupId, manage }) => {
  const [query, { data, error, loading }] = useGroupMembersLazyQuery();
  useSnackbarError(error);

  const [changeRole, { error: changeRoleError }] =
    useChangeUserGroupMembershipRoleMutation();
  useSnackbarError(changeRoleError);

  const { enqueueSnackbar } = useSnackbar();
  const onChangeRole = useCallback(
    (member: GroupMembershipFieldsFragment) =>
      async (event: SelectChangeEvent) => {
        const role = event.target.value as GroupMembershipRole;
        await changeRole({
          variables: {
            userId: member.user.id,
            groupId,
            role,
          },
          update: (cache) => {
            cache.updateFragment(
              {
                fragment: GroupMembershipFieldsFragmentDoc,
                fragmentName: "groupMembershipFields",
                id: `GroupMembership:${member.id}`,
              },
              (existing) => ({
                ...existing,
                role,
              })
            );
          },
        });
        enqueueSnackbar(
          `Changed role of ${member.user.name || member.user.id} to ${
            groupRoles[role]
          }.`,
          { variant: "success" }
        );
      },
    [changeRole, enqueueSnackbar, groupId]
  );

  const pageInfo: PageInfoFieldsFragment = useMemo(
    () =>
      data?.node?.__typename === "Group"
        ? data.node.members.pageInfo
        : {
            hasNextPage: false,
            hasPreviousPage: false,
          },
    [data]
  );

  const where = useMemo(() => ({}), []);
  const pagination = useGroupMembersPagination({
    query,
    pageInfo,
    groupId,
    where,
  });

  const members = useMemo(
    () =>
      data?.node?.__typename === "Group"
        ? data.node.members.edges?.map((e) => e && e.node) ?? []
        : [],
    [data]
  );

  const totalCount = useMemo(
    () =>
      data?.node?.__typename === "Group" ? data.node.members.totalCount : -1,
    [data]
  );

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={2}>
                <Typography>Loading...</Typography>
              </TableCell>
            </TableRow>
          )}
          {members.length === 0 && (
            <TableRow>
              <TableCell colSpan={2}>
                <Typography>Nothing found</Typography>
              </TableCell>
            </TableRow>
          )}
          {members.map(
            (member) =>
              member && (
                <TableRow key={member.id}>
                  <TableCell>
                    <Stack alignItems="center" direction="row">
                      <Avatar
                        src={member.user.avatarURL}
                        sx={{
                          mr: 1,
                        }}
                      />
                      <Typography>
                        {member.user.name || member.user.id}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {manage ? (
                      <Select
                        sx={{ minWidth: 120 }}
                        value={member.role}
                        onChange={onChangeRole(member)}
                      >
                        {Object.entries(groupRoles).map(([key, value]) => (
                          <MenuItem key={key} value={key}>
                            {value}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      groupRoles[member.role]
                    )}
                  </TableCell>
                </TableRow>
              )
          )}
          <TableRow>
            <TablePagination count={totalCount} {...pagination} />
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

export default Members;
