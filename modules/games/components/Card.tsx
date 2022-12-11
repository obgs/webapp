import PeopleIcon from "@mui/icons-material/People";
import {
  Card as MUICard,
  CardActions,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

import { GameFieldsFragment } from "graphql/generated";

interface Props {
  game: GameFieldsFragment;
}

const Card: React.FC<Props> = ({ game }) => {
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
          justifyContent: "flex-end",
        }}
      >
        <Stack direction="row" spacing={1}>
          <PeopleIcon />
          <Typography>
            {game.minPlayers} - {game.maxPlayers}
          </Typography>
        </Stack>
      </CardActions>
    </MUICard>
  );
};

export default Card;
