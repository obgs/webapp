import {
  Container,
  TablePagination,
  TablePaginationProps,
  Typography,
} from "@mui/material";
import React from "react";

import Card from "./Card";
import { GroupFieldsFragment } from "graphql/generated";

interface Props {
  groups?: Array<GroupFieldsFragment | null | undefined> | null;
  loading: boolean;
  toolbar?: React.ReactNode;
  paginationProps?: TablePaginationProps;
}

const List: React.FC<Props> = ({
  groups,
  loading,
  toolbar,
  paginationProps,
}) => {
  return (
    <Container>
      {toolbar}
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
        {...paginationProps}
        labelRowsPerPage="Results per page:"
      />
    </Container>
  );
};

export default List;
