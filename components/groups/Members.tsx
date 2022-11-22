import {
  Avatar,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useMemo } from "react";

import {
  GroupFieldsFragment,
  PageInfoFieldsFragment,
  useGroupMembersLazyQuery,
} from "../../graphql/generated";
import useSnackbarError from "../../utils/apollo/useSnackbarError";
import groupRoles from "../../utils/groupRoles";
import useGroupMembersPagination from "./useGroupMembersPagination";

interface Props {
  group: GroupFieldsFragment;
}

const Members: React.FC<Props> = ({ group }) => {
  const [query, { data, error, loading }] = useGroupMembersLazyQuery();
  useSnackbarError(error);

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
    groupId: group.id,
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
                  <TableCell>{groupRoles[member.role]}</TableCell>
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
