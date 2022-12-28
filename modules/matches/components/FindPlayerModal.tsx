import { Button, Modal, Paper, Stack } from "@mui/material";
import React, { useState } from "react";

import PlayerAutocomplete from "components/PlayerAutocomplete";
import { PlayerFieldsFragment } from "graphql/generated";

interface Props {
  onConfirm: (player: PlayerFieldsFragment) => void;
  open: boolean;
  onClose: () => void;
}

const FindPlayerModal: React.FC<Props> = ({ onConfirm, open, onClose }) => {
  const [player, setPlayer] = useState<PlayerFieldsFragment | null>(null);

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper sx={{ p: 2 }}>
        <PlayerAutocomplete onChange={(p) => setPlayer(p)} />
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!player}
            onClick={() => player && onConfirm(player)}
          >
            Confirm
          </Button>
        </Stack>
      </Paper>
    </Modal>
  );
};

export default FindPlayerModal;
