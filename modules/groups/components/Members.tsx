import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import {
  Avatar,
  Box,
  IconButton,
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
  Tooltip,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useCallback, useMemo, useState } from "react";

import KickMemberModal from "./KickMemberModal";
import useGroupMembersPagination from "./useGroupMembersPagination";
import {
  GroupMembershipFieldsFragment,
  GroupMembershipFieldsFragmentDoc,
  GroupMembershipRole,
  PageInfoFieldsFragment,
  useChangeUserGroupMembershipRoleMutation,
  useGroupMembersLazyQuery,
} from "graphql/generated";
import { useSnackbarError } from "utils/apollo";
import groupRoles from "utils/groupRoles";
import { useUser } from "utils/user";

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

  const fullRow = useMemo(() => (manage ? 3 : 2), [manage]);
  const [kickMemberModalOpen, setKickMemberModalOpen] = useState(false);
  const [kickedMember, setKickedMember] =
    useState<GroupMembershipFieldsFragment | null>(null);

  const onKickMember = useCallback(
    (member: GroupMembershipFieldsFragment) => () => {
      setKickedMember(member);
      setKickMemberModalOpen(true);
    },
    []
  );

  const { user } = useUser();

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Role</TableCell>
            {manage && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={fullRow}>
                <Typography>Loading...</Typography>
              </TableCell>
            </TableRow>
          )}
          {members.length === 0 && (
            <TableRow>
              <TableCell colSpan={fullRow}>
                <Typography>Nothing found</Typography>
              </TableCell>
            </TableRow>
          )}
          {members.map(
            (member) =>
              member && (
                <TableRow key={member.id}>
                  <TableCell>
                    <Stack spacing={1} alignItems="center" direction="row">
                      <Avatar src={member.user.avatarURL} />
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
                  {manage && (
                    <TableCell>
                      {member.user.id !== user?.id && (
                        <Tooltip
                          title={`Kick ${member.user.name || member.user.id}`}
                        >
                          <IconButton onClick={onKickMember(member)}>
                            <PersonRemoveIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )
          )}
          <TableRow>
            <TablePagination count={totalCount} {...pagination} />
          </TableRow>
        </TableBody>
      </Table>
      {kickedMember && (
        <KickMemberModal
          open={kickMemberModalOpen}
          onClose={() => setKickMemberModalOpen(false)}
          member={kickedMember}
          groupId={groupId}
        />
      )}
    </Box>
  );
};

export default Members;
