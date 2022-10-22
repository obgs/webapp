import { LoadingButton } from "@mui/lab";
import { CardActions } from "@mui/material";
import React from "react";

import {
  GroupFieldsFragment,
  GroupSettingsJoinPolicy,
} from "../../../graphql/generated";
import useAuth from "../../../utils/auth/useAuth";

interface Props {
  group: GroupFieldsFragment;
}

const GroupCardActions: React.FC<Props> = ({ group }) => {
  const { authenticated } = useAuth();

  if (!authenticated || group.isMember) {
    return null;
  }

  let joinButton: React.ReactNode = null;

  if (group.settings.joinPolicy === GroupSettingsJoinPolicy.Open) {
    joinButton = (
      <LoadingButton variant="contained" loading={false}>
        Join
      </LoadingButton>
    );
  }
  if (group.settings.joinPolicy === GroupSettingsJoinPolicy.ApplicationOnly) {
    joinButton = (
      <LoadingButton variant="contained" loading={false}>
        Apply
      </LoadingButton>
    );
  }

  return <CardActions>{joinButton}</CardActions>;
};

export default GroupCardActions;
