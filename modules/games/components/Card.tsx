import PeopleIcon from "@mui/icons-material/People";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import {
  Card as MUICard,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useCallback } from "react";

import {
  GameFieldsFragment,
  GameFieldsFragmentDoc,
  useAddOrRemoveGameFromFavoritesMutation,
} from "graphql/generated";
import { useAuth } from "modules/auth";
import { useSnackbarError } from "utils/apollo";

interface Props {
  game: GameFieldsFragment;
}

const Card: React.FC<Props> = ({ game }) => {
  const { authenticated } = useAuth();

  const [favorite, { error }] = useAddOrRemoveGameFromFavoritesMutation();
  useSnackbarError(error);

  const handleFavorite = useCallback(async () => {
    const currentValue = game.isFavorite;
    await favorite({
      variables: {
        id: game.id,
        favorite: !currentValue,
      },
      update: (cache) => {
        cache.updateFragment<GameFieldsFragment>(
          {
            id: `Game:${game.id}`,
            fragment: GameFieldsFragmentDoc,
            fragmentName: "gameFields",
          },
          (existing) =>
            existing && {
              ...existing,
              isFavorite: !currentValue,
              favorites: {
                ...existing.favorites,
                total: currentValue
                  ? existing.favorites.total - 1
                  : existing.favorites.total + 1,
              },
            }
        );
      },
    });
  }, [favorite, game]);

  return (
    <MUICard key={game.id}>
      <CardHeader
        title={<Typography variant="h5">{game.name}</Typography>}
        subheader={
          <Typography variant="body2">by {game.author.name}</Typography>
        }
      />
      <CardContent>
        <Typography>{game.description || "No description"}</Typography>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <PeopleIcon />
          <Typography>
            {game.minPlayers} - {game.maxPlayers}
          </Typography>
        </Stack>
        <IconButton
          disabled={!authenticated}
          aria-label="add to favorites"
          onClick={handleFavorite}
          sx={{
            borderRadius: 2,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {game.isFavorite ? <StarIcon /> : <StarOutlineIcon />}
            <Typography>{game.favorites.total}</Typography>
          </Stack>
        </IconButton>
      </CardActions>
    </MUICard>
  );
};

export default Card;
