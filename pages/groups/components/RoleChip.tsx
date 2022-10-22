import { Chip, Tooltip } from "@mui/material";
import React from "react";

import {
  GroupFieldsFragment,
  GroupMembershipRole,
} from "../../../graphql/generated";

interface Props {
  group: GroupFieldsFragment;
}

const roles: Record<GroupMembershipRole, string> = {
  [GroupMembershipRole.Admin]: "Admin",
  [GroupMembershipRole.Member]: "Member",
  [GroupMembershipRole.Owner]: "Owner",
};

const GroupRoleChip: React.FC<Props> = ({ group }) => {
  if (!group.role) {
    return null;
  }

  return (
    <Tooltip title="Your role in this group">
      <Chip size="small" label={roles[group.role]} />
    </Tooltip>
  );
};

export default GroupRoleChip;
