import { Typography } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";

import RequestPlayerSupervisionModal from "../../components/players/RequestSupervisionModal";
import PlayerSearch from "../../components/players/Search";
import {
  PlayerFieldsFragment,
  PlayerWhereInput,
} from "../../graphql/generated";
import { useUser } from "utils/user";

const RequestSupervision = () => {
  const { user } = useUser();

  const notSupervisedOrOwnedByMe: PlayerWhereInput = useMemo(
    () => ({
      and: [
        {
          not: {
            hasSupervisorsWith: [
              {
                id: user?.id,
              },
            ],
          },
        },
        {
          or: [
            {
              hasOwner: false,
            },
            {
              not: {
                hasOwnerWith: [
                  {
                    id: user?.id,
                  },
                ],
              },
            },
          ],
        },
      ],
    }),
    [user?.id]
  );

  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestedPlayer, setRequestedPlayer] =
    useState<PlayerFieldsFragment>();
  const onSelect = useCallback((player: PlayerFieldsFragment) => {
    setRequestedPlayer(player);
    setRequestModalOpen(true);
  }, []);

  return (
    <>
      <Typography variant="body1">
        Here you can request supervision of any player in the system. Use the
        filters below to find players that you need.
      </Typography>
      <PlayerSearch filter={notSupervisedOrOwnedByMe} onSelect={onSelect} />
      {requestedPlayer && (
        <RequestPlayerSupervisionModal
          open={requestModalOpen}
          onClose={() => setRequestModalOpen(false)}
          player={requestedPlayer}
        />
      )}
    </>
  );
};

export default RequestSupervision;
