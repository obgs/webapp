import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Stack,
  TablePagination,
  TablePaginationProps,
  Typography,
} from "@mui/material";
import pluralize from "pluralize";
import React from "react";

import { GroupFieldsFragment } from "../../../graphql/generated";
import GroupCardActions from "./CardActions";
import GroupJoinPolicyChip from "./JoinPolicyChip";

interface Props {
  groups?: Array<GroupFieldsFragment | null | undefined> | null;
  loading: boolean;
  toolbar?: React.ReactNode;
  paginationProps?: TablePaginationProps;
}

const GroupList: React.FC<Props> = ({
  groups,
  loading,
  toolbar,
  paginationProps,
}) => {
  return (
    <Container>
      {toolbar}
      {loading && <Typography>Loading...</Typography>}
      {groups?.length === 0 && (
        <Typography variant="h4">No groups found</Typography>
      )}
      {groups?.map(
        (group) =>
          group && (
            <Card key={group.id} sx={{ mb: 2 }} variant="outlined">
              <CardHeader
                avatar={<Avatar src={group.logoURL} />}
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h5">{group.name}</Typography>
                    <GroupJoinPolicyChip group={group} />
                    {group.isMember && <Chip size="small" label="Member" />}
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
          )
      )}
      {/* https://github.com/mui/material-ui/issues/15827 */}
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <TablePagination
        component="div"
        {...paginationProps}
        labelRowsPerPage="Results per page:"
      />
    </Container>
  );
};

export default GroupList;
