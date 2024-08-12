import { LazyQueryExecFunction } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";

import { PageInfoFieldsFragment } from "graphql/generated";

const rowsPerPageOptions = [10, 20, 50];

type Search<Query, Input> = LazyQueryExecFunction<
  Query,
  {
    before?: unknown;
    after?: unknown;
    where: Input;
    first?: number | null;
    last?: number | null;
  }
>;

interface Props<Query, Input> {
  query: Search<Query, Input>;
  where: Input;
  pageInfo?: PageInfoFieldsFragment;
}

const usePagination = <Query, Input>({
  query,
  where,
  pageInfo,
}: Props<Query, Input>) => {
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [page, setPage] = useState(0);

  // do the initial search
  useEffect(() => {
    query({
      variables: {
        where,
        first: rowsPerPage,
      },
    });
  }, [query, where, rowsPerPage]);

  const searchWithCriteria = useCallback(
    (first = rowsPerPage) => {
      setPage(0);
      query({
        variables: {
          first,
          where,
        },
      });
    },
    [rowsPerPage, query, where]
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
          ...(p < page
            ? { before: pageInfo?.startCursor, last: rowsPerPage }
            : { after: pageInfo?.endCursor, first: rowsPerPage }),
          where,
        },
      });
      setPage(p);
    },
    [query, page, pageInfo, rowsPerPage, where]
  );

  return {
    searchWithCriteria,
    onRowsPerPageChange,
    onPageChange,
    page,
    rowsPerPage,
    rowsPerPageOptions,
  };
};

export default usePagination;
