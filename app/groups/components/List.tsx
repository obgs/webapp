"use client";

import { Box, Button, TablePagination, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";

import Card from "@/groups/components/Card";
import { useSearchGroupsLazyQuery } from "graphql/generated";
import { useAuth } from "modules/auth";
import { usePagination, useSnackbarError } from "utils/apollo";

const List = () => {
  const [search, { data, error, loading }] = useSearchGroupsLazyQuery();
  useSnackbarError(error);
  const { authenticated } = useAuth();

  const where = useMemo(() => ({}), []);
  // we don't need these vars for now
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    searchWithCriteria: _,
    ...pagination
  } = usePagination({
    query: search,
    where,
    pageInfo: data?.groups.pageInfo,
  });

  const groups = useMemo(() => data?.groups.edges?.map((e) => e?.node), [data]);
  const totalGroups = useMemo(() => data?.groups.totalCount || 0, [data]);

  const router = useRouter();

  return (
    <>
      {authenticated && (
        <Box mb={2}>
          <Button
            variant="contained"
            onClick={() => router.push("/groups/new")}
          >
            Create new group
          </Button>
        </Box>
      )}
      {loading && <Typography>Loading...</Typography>}
      {groups?.length === 0 && (
        <Typography variant="h4">No groups found</Typography>
      )}
      {groups?.map((group) => group && <Card key={group.id} group={group} />)}
      {/* https://github.com/mui/material-ui/issues/15827 */}
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <TablePagination
        component="div"
        {...pagination}
        count={!groups ? -1 : totalGroups}
        labelRowsPerPage="Results per page:"
      />
    </>
  );
};

export default List;
