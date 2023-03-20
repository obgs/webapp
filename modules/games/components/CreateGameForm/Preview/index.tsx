import { LoadingButton } from "@mui/lab";
import { Button, Card, CardActions, CardContent } from "@mui/material";
import React from "react";

import { FormValues } from "..";

interface Props {
  values: FormValues;
  loading: boolean;
  goBack: () => void;
  onSubmit: () => void;
}

const Preview: React.FC<Props> = ({ values, loading, goBack, onSubmit }) => {
  return (
    <Card>
      <CardContent>
        The preview will be here. Take the values for now:{" "}
        {JSON.stringify(values)}
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
