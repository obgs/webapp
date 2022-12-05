import SettingsIcon from "@mui/icons-material/Settings";
import {
  Avatar,
  Card as MUICard,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import pluralize from "pluralize";
import React from "react";

import CardActions from "./CardActions";
import GroupJoinPolicyChip from "./JoinPolicyChip";
import GroupRoleChip from "./RoleChip";
import { GroupFieldsFragment, GroupMembershipRole } from "graphql/generated";

interface Props {
  group: GroupFieldsFragment;
  showSettings?: boolean;
}

const Card: React.FC<Props> = ({ group, showSettings }) => {
  return (
    <MUICard key={group.id} sx={{ mb: 2 }} variant="outlined">
      <CardHeader
        avatar={<Avatar src={group.logoURL} />}
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h5">
              <Link href={`/groups/${group.id}`} passHref>
                {group.name}
              </Link>
            </Typography>
            <GroupJoinPolicyChip group={group} />
            <GroupRoleChip group={group} />
          </Stack>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            {group.members.totalCount}{" "}
            {pluralize("member", group.members.totalCount)}
          </Typography>
        }
        action={
          showSettings &&
          group.role &&
          [GroupMembershipRole.Admin, GroupMembershipRole.Owner].includes(
            group.role
          ) && (
            <Link href={`/groups/${group.id}/manage`} passHref>
              <IconButton>
                <SettingsIcon />
              </IconButton>
            </Link>
          )
        }
      />
      {group.description && (
        <CardContent>
          <Typography variant="body1">{group.description}</Typography>
        </CardContent>
      )}
      <CardActions group={group} />
    </MUICard>
  );
};

export default Card;
