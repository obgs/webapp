import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TablePaginationProps,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

import { GroupFieldsFragment } from "../../../graphql/generated";

interface Props {
  groups?: Array<GroupFieldsFragment | null | undefined> | null;
  loading: boolean;
  toolbar?: React.ReactNode;
  paginationProps?: TablePaginationProps;
}

const GroupList: React.FC<Props> = ({
  groups,
  loading,
  toolbar,
  paginationProps,
}) => {
  return (
    <Paper>
      {toolbar}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Members</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell rowSpan={2}>
                <Typography>Loading...</Typography>
              </TableCell>
            </TableRow>
          )}
          {groups?.length === 0 && (
            <TableRow>
              <TableCell rowSpan={2}>
                <Typography>Nothing found</Typography>
              </TableCell>
            </TableRow>
          )}
          {groups?.map(
            (group) =>
              group && (
                <TableRow hover key={group.id}>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>{group.members.totalCount}</TableCell>
                </TableRow>
              )
          )}
          {paginationProps && (
            <TableRow>
              <TablePagination {...paginationProps} />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default GroupList;
