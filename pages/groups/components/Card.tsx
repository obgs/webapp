import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import pluralize from "pluralize";
import React from "react";

import { GroupFieldsFragment } from "../../../graphql/generated";
import GroupCardActions from "./CardActions";
import GroupJoinPolicyChip from "./JoinPolicyChip";
import GroupRoleChip from "./RoleChip";

interface Props {
  group: GroupFieldsFragment;
}

const GroupCard: React.FC<Props> = ({ group }) => {
  return (
    <Card key={group.id} sx={{ mb: 2 }} variant="outlined">
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
      />
      {group.description && (
        <CardContent>
          <Typography variant="body1">{group.description}</Typography>
        </CardContent>
      )}
      <GroupCardActions group={group} />
    </Card>
  );
};

export default GroupCard;
