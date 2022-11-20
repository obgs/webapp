import { Chip, Tooltip } from "@mui/material";
import React from "react";

import { GroupFieldsFragment } from "../../../graphql/generated";
import roles from "../helpers/roles";

interface Props {
  group: GroupFieldsFragment;
}

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
