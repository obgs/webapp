import ReplayIcon from "@mui/icons-material/Replay";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
} from "@mui/material";
import React, { useMemo, useState } from "react";

import {
  PlayerFieldsFragment,
  PlayerWhereInput,
  useSearchPlayersLazyQuery,
} from "../../../graphql/generated";
import usePagination from "../../../utils/apollo/usePagination";
import useSnackbarError from "../../../utils/apollo/useSnackbarError";
import PlayersList from "./List";

interface Props {
  onSelect?: (player: PlayerFieldsFragment) => void;
  filter?: PlayerWhereInput;
}

const PlayerSearch: React.FC<Props> = ({ onSelect, filter }) => {
  const [name, setName] = useState("");
  const [strictSearch, setStrictSearch] = useState(false);

  const [search, { data, loading, error }] = useSearchPlayersLazyQuery();
  useSnackbarError(error);

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

  const { searchWithCriteria, ...pagination } = usePagination({
    query: search,
    where,
    pageInfo: data?.players.pageInfo,
  });

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
          <Button variant="contained" onClick={() => searchWithCriteria()}>
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
                <IconButton onClick={() => searchWithCriteria()}>
                  <ReplayIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Toolbar>
        }
        paginationProps={{
          count: !players ? -1 : totalPlayers,
          ...pagination,
        }}
        onSelect={onSelect}
      />
    </>
  );
};

export default PlayerSearch;
