import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import PlayersList from "./List";
import {
  PlayerFieldsFragment,
  PlayerWhereInput,
  useSearchPlayersLazyQuery,
} from "../../../graphql/generated";
import ReplayIcon from "@mui/icons-material/Replay";

interface Props {
  onSelect?: (player: PlayerFieldsFragment) => void;
  filter?: PlayerWhereInput;
}

const rowsPerPageOptions = [10, 20, 50];

const PlayerSearch: React.FC<Props> = ({ onSelect, filter }) => {
  const [name, setName] = useState("");
  const [strictSearch, setStrictSearch] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [page, setPage] = useState(0);

  const [search, { data, loading, error }] = useSearchPlayersLazyQuery();

  // do the initial search
  useEffect(() => {
    search({
      variables: {
        first: rowsPerPageOptions[0],
        where: filter ?? {},
      },
    });
  }, [filter, search]);

  const players = useMemo(
    () => data?.players.edges?.map((e) => e?.node),
    [data]
  );

  const totalPlayers = useMemo(() => data?.players.totalCount || 0, [data]);

  const where = useMemo(() => {
    // we have to assing the where object to a variable because otherwise
    // typescript will allow any property to be set on it
    const clause: PlayerWhereInput = filter ?? {};
    if (!name) return clause;
    if (strictSearch) {
      clause.name = name;
    } else {
      clause.nameContains = name;
    }
    return clause;
  }, [filter, name, strictSearch]);

  const searchWithCriteria = useCallback(() => {
    setPage(0);
    search({
      variables: {
        first: rowsPerPage,
        where,
      },
    });
  }, [search, rowsPerPage, where]);

  // when the amount of rows per page changes, go back to page 0
  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(newRowsPerPage);
      setPage(0);
      searchWithCriteria();
    },
    [searchWithCriteria]
  );

  const handlePageChange = useCallback(
    (_: unknown, p: number) => {
      search({
        variables: {
          ...(p < page
            ? { before: data?.players.pageInfo.startCursor, last: rowsPerPage }
            : { after: data?.players.pageInfo.endCursor, first: rowsPerPage }),
          where,
        },
      });
      setPage(p);
    },
    [data?.players.pageInfo, page, rowsPerPage, search, where]
  );

  return (
    <>
      <Box mt={2} mb={2}>
        <Stack direction="row">
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Box ml={3}>
            <FormControlLabel
              control={
                <Checkbox
                  value={strictSearch}
                  onChange={(e) => setStrictSearch(e.target.checked)}
                />
              }
              label="Use strict search"
            />
          </Box>
          <Button variant="contained" onClick={searchWithCriteria}>
            Search
          </Button>
        </Stack>
      </Box>
      <PlayersList
        players={players}
        loading={loading}
        toolbar={
          <Toolbar>
            <Stack alignItems="flex-end" flex={1}>
              <Tooltip title="Reload">
                <IconButton onClick={searchWithCriteria}>
                  <ReplayIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Toolbar>
        }
        paginationProps={{
          rowsPerPage: rowsPerPage,
          rowsPerPageOptions,
          onRowsPerPageChange: handleRowsPerPageChange,
          count: !players ? -1 : totalPlayers,
          page,
          onPageChange: handlePageChange,
        }}
        onSelect={onSelect}
      />
      <Snackbar open={!!error}>
        <Alert severity="error">
          {error?.message || "Something went wrong"}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PlayerSearch;
