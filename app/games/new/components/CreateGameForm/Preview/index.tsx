import RefreshIcon from "@mui/icons-material/Refresh";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import React, { useCallback, useState } from "react";

import generateMatchPreview from "./generateMatchPreview";
import MatchTable from "@/matches/components/MatchTable";
import { FormValues } from "app/games/new/components/CreateGameForm";

interface Props {
  values: FormValues;
  loading: boolean;
  goBack: () => void;
  onSubmit: () => void;
}

const Preview: React.FC<Props> = ({ values, loading, goBack, onSubmit }) => {
  const [match, setMatch] = useState(generateMatchPreview(values));
  const reGenerateMatch = useCallback(
    () => setMatch(generateMatchPreview(values)),
    [values]
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Preview</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          This is how a typical match for the game you are creating will look
          like.
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <MatchTable match={match} />
        <Divider sx={{ mb: 2, mt: 2 }} />
        <Button
          variant="contained"
          endIcon={<RefreshIcon />}
          onClick={reGenerateMatch}
        >
          Re-generate
        </Button>
      </CardContent>
      <CardActions>
        <Button onClick={goBack}>Back</Button>
        <LoadingButton variant="contained" loading={loading} onClick={onSubmit}>
          Create game
        </LoadingButton>
      </CardActions>
    </Card>
  );
};

export default Preview;
