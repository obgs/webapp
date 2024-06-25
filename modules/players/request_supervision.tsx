import { Typography } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";

import RequestSupervisionModal from "./components/RequestSupervisionModal";
import Search from "./components/Search";
import { PlayerFieldsFragment, PlayerWhereInput } from "graphql/generated";
import { Title } from "modules/nav";
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
      <Title text="Request player supervision" />
      <Typography variant="body1">
        Here you can request supervision of any player in the system. Use the
        filters below to find players that you need.
      </Typography>
      <Search filter={notSupervisedOrOwnedByMe} onSelect={onSelect} />
      {requestedPlayer && (
        <RequestSupervisionModal
          open={requestModalOpen}
          onClose={() => setRequestModalOpen(false)}
          player={requestedPlayer}
        />
      )}
    </>
  );
};

export default RequestSupervision;
