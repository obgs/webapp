import { LazyQueryExecFunction } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";

import {
  GroupMembershipWhereInput,
  GroupMembersQuery,
  GroupMembersQueryVariables,
  PageInfoFieldsFragment,
} from "graphql/generated";

const rowsPerPageOptions = [10, 20, 50];

interface Props {
  query: LazyQueryExecFunction<GroupMembersQuery, GroupMembersQueryVariables>;
  where: GroupMembershipWhereInput;
  groupId: string;
  pageInfo?: PageInfoFieldsFragment;
}

const useGroupMembersPagination = ({
  query,
  where,
  pageInfo,
  groupId,
}: Props) => {
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [page, setPage] = useState(0);

  // do the initial search
  useEffect(() => {
    query({
      variables: {
        groupId,
        where,
        first: rowsPerPage,
      },
    });
  }, [query, where, rowsPerPage, groupId]);

  const searchWithCriteria = useCallback(
    (first = rowsPerPage) => {
      setPage(0);
      query({
        variables: {
          groupId,
          first,
          where,
        },
      });
    },
    [rowsPerPage, query, groupId, where]
  );

  // when the amount of rows per page changes, go back to page 0
  const onRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(newRowsPerPage);
      setPage(0);
      searchWithCriteria(newRowsPerPage);
    },
    [searchWithCriteria]
  );

  const onPageChange = useCallback(
    (_: unknown, p: number) => {
      query({
        variables: {
          groupId,
          ...(p < page
            ? { before: pageInfo?.startCursor, last: rowsPerPage }
            : { after: pageInfo?.endCursor, first: rowsPerPage }),
          where,
        },
      });
      setPage(p);
    },
    [query, groupId, page, pageInfo, rowsPerPage, where]
  );

  return {
    onRowsPerPageChange,
    onPageChange,
    page,
    rowsPerPage,
    rowsPerPageOptions,
  };
};

export default useGroupMembersPagination;
