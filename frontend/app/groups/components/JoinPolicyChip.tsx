import { Chip, Tooltip } from "@mui/material";
import React from "react";

import {
  GroupFieldsFragment,
  GroupSettingsJoinPolicy,
} from "graphql/generated";

interface Props {
  group: GroupFieldsFragment;
}

const description: Record<
  GroupSettingsJoinPolicy,
  {
    tooltip: string;
    label: string;
  }
> = {
  [GroupSettingsJoinPolicy.Open]: { tooltip: "Anyone can join", label: "Open" },
  [GroupSettingsJoinPolicy.ApplicationOnly]: {
    tooltip: "You need to apply to join",
    label: "Application only",
  },
  [GroupSettingsJoinPolicy.InviteOnly]: {
    tooltip: "You need to be invited to join",
    label: "Invite only",
  },
  [GroupSettingsJoinPolicy.InviteOrApplication]: {
    tooltip: "You need to be invited or apply to join",
    label: "Invite or application",
  },
};

const GroupJoinPolicyChip: React.FC<Props> = ({ group }) => {
  const { tooltip, label } = description[group.settings.joinPolicy];
  return (
    <Tooltip title={tooltip}>
      <Chip size="small" label={label} />
    </Tooltip>
  );
};

export default GroupJoinPolicyChip;
