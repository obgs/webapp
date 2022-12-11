import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";

import Card from "./components/Card";
import { GameWhereInput, useSearchGamesLazyQuery } from "graphql/generated";
import { useAuth } from "modules/auth";
import { usePagination, useSnackbarError } from "utils/apollo";

const Browse = () => {
  const [search, { data, loading, error }] = useSearchGamesLazyQuery();
  useSnackbarError(error);

  const { authenticated } = useAuth();
  const router = useRouter();

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
    <Container>
      <Typography variant="body1">
        Games are the templates for your statistics. They are created and
        maintained by community members. You can create your own games or use
        existing ones.
      </Typography>
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
      {authenticated && (
        <Button
          variant="contained"
          sx={{ mb: 1 }}
          onClick={() => router.push("/games/new")}
        >
          Create new game
        </Button>
      )}
      {loading && <Typography>Loading...</Typography>}
      {!games?.length && <Typography>No games found</Typography>}
      <Stack spacing={2}>
        {games?.map((game) => game && <Card key={game.id} game={game} />)}
      </Stack>
    </Container>
  );
};

export default Browse;
