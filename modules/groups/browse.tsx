import { Box, Button } from "@mui/material";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

import List from "./components/List";
import { useSearchGroupsLazyQuery } from "graphql/generated";
import { useAuth } from "modules/auth";
import { usePagination, useSnackbarError } from "utils/apollo";

const Browse = () => {
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
    <List
      groups={groups}
      loading={loading}
      toolbar={
        authenticated && (
          <Box mb={2}>
            <Button
              variant="contained"
              onClick={() => router.push("/groups/new")}
            >
              Create new group
            </Button>
          </Box>
        )
      }
      paginationProps={{
        ...pagination,
        count: !groups ? -1 : totalGroups,
      }}
    />
  );
};

export default Browse;
