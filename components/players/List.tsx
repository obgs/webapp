import React from "react";
import { PlayerFieldsFragment } from "../../graphql/generated";
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

interface Props {
  players?: Array<PlayerFieldsFragment | null | undefined> | null;
  loading: boolean;
  toolbar?: React.ReactNode;
  paginationProps?: TablePaginationProps;
}

const PlayersList: React.FC<Props> = ({
  players,
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
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Supervisors</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell>
                <Typography>Loading...</Typography>
              </TableCell>
            </TableRow>
          )}
          {players?.length === 0 && (
            <TableRow>
              <TableCell>
                <Typography>Nothing found</Typography>
              </TableCell>
            </TableRow>
          )}
          {players?.map(
            (player) =>
              player && (
                <TableRow key={player.id}>
                  <TableCell>{player.id}</TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>
                    {player.owner ? player.owner.name : "None"}
                  </TableCell>
                  <TableCell>{player.supervisors?.length}</TableCell>
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

export default PlayersList;
