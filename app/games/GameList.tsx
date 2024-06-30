"use client";

import { Button, Stack, TextField, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";

import Card from "./Card";
import CreateNewGameButton from "./CreateNewGameButton";
import { GameWhereInput, useSearchGamesLazyQuery } from "graphql/generated";
import { usePagination, useSnackbarError } from "utils/apollo";

const GameList = () => {
  const [search, { data, loading, error }] = useSearchGamesLazyQuery();
  useSnackbarError(error);

  const games = useMemo(() => data?.games.edges?.map((e) => e?.node), [data]);

  const [name, setName] = useState("");
  const where: GameWhereInput = useMemo(
    () => ({
      nameContains: name,
    }),
    [name]
  );
  const { searchWithCriteria } = usePagination({
    query: search,
    where,
    pageInfo: data?.games.pageInfo,
  });

  return (
    <>
      <Stack direction="row" mb={1} mt={1} spacing={2}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button variant="contained" onClick={() => searchWithCriteria()}>
          Search
        </Button>
      </Stack>
      <CreateNewGameButton />
      {loading && <Typography>Loading...</Typography>}
      {!games?.length && <Typography>No games found</Typography>}
      <Stack spacing={2}>
        {games?.map((game) => game && <Card key={game.id} game={game} />)}
      </Stack>
    </>
  );
};

export default GameList;
