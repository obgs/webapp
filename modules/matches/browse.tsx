import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Button,
  Checkbox,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
} from "@mui/material";
import Link from "next/link";
import React, { useMemo, useState } from "react";

import {
  MatchWhereInput,
  PlayerWhereInput,
  useSearchMatchesLazyQuery,
} from "graphql/generated";
import { usePagination, useSnackbarError } from "utils/apollo";
import { useUser } from "utils/user";

const Browse = () => {
  const { user } = useUser();
  const [search, { data, error, loading }] = useSearchMatchesLazyQuery();
  const [showMyMatches, setShowMyMatches] = useState(true);
  const [showSupervisedPlayersMatches, setShowSupervisedPlayersMatches] =
    useState(false);

  useSnackbarError(error);

  const where = useMemo(() => {
    const res: MatchWhereInput = {};
    if (!showMyMatches && !showSupervisedPlayersMatches) {
      return res;
    }

    const players: Array<PlayerWhereInput> = [];
    if (showMyMatches && user) {
      players.push({
        hasOwnerWith: [{ id: user.id }],
      });
    }

    if (showSupervisedPlayersMatches && user) {
      players.push({
        hasSupervisorsWith: [{ id: user.id }],
      });
    }

    if (players.length) {
      res.hasPlayersWith = [
        {
          or: players,
        },
      ];
    }

    return res;
  }, [showMyMatches, showSupervisedPlayersMatches, user]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { searchWithCriteria: _, ...pagination } = usePagination({
    query: search,
    where,
    pageInfo: data?.matches.pageInfo,
  });

  const matches = useMemo(
    () => data?.matches.edges?.map((e) => e?.node),
    [data]
  );

  const totalCount = useMemo(() => data?.matches.totalCount ?? -1, [data]);
  const [filterAnchor, setFilterAnchor] = React.useState<null | HTMLElement>(
    null
  );
  const filterMenuOpen = Boolean(filterAnchor);
  const openFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchor(event.currentTarget);
  };
  const closeFilters = () => {
    setFilterAnchor(null);
  };

  return (
    <Container>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Link href={"/matches/new"}>
          <Button variant="contained">Create match</Button>
        </Link>
        <IconButton onClick={openFilters}>
          <FilterListIcon />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={filterAnchor}
          open={filterMenuOpen}
          onClose={closeFilters}
        >
          <MenuItem onClick={() => setShowMyMatches(!showMyMatches)}>
            <Checkbox checked={showMyMatches} />
            Matches including me
          </MenuItem>
          <MenuItem
            onClick={() =>
              setShowSupervisedPlayersMatches(!showSupervisedPlayersMatches)
            }
          >
            <Checkbox checked={showSupervisedPlayersMatches} />
            Matches including supervised players
          </MenuItem>
        </Menu>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Game</TableCell>
            <TableCell>Players</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!matches?.length && !loading && (
            <TableRow>
              <TableCell colSpan={2}>No matches found</TableCell>
            </TableRow>
          )}
          {loading && (
            <TableRow>
              <TableCell colSpan={2}>Loading...</TableCell>
            </TableRow>
          )}
          {matches?.map(
            (match) =>
              match && (
                <TableRow key={match.id}>
                  <TableCell>{match.game.name}</TableCell>
                  <TableCell>
                    {match.players
                      .map(
                        (player) =>
                          player.name || player.owner?.name || player.owner?.id
                      )
                      .join(", ")}
                  </TableCell>
                </TableRow>
              )
          )}
          <TableRow>
            <TablePagination count={totalCount} {...pagination} />
          </TableRow>
        </TableBody>
      </Table>
    </Container>
  );
};

export default Browse;
