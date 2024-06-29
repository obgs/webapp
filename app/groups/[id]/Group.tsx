"use client";

import ErrorIcon from "@mui/icons-material/Error";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Stack,
  Tab,
} from "@mui/material";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";

import Card from "@/groups/components/Card";
import Members from "@/groups/components/Members";
import { useGroupQuery } from "graphql/generated";
import { useSnackbarError } from "utils/apollo";

const Group: React.FC = () => {
  const params = useParams();
  const id = params?.id;

  const { data, loading, error } = useGroupQuery({
    skip: !id || typeof id !== "string",
    variables: {
      id: id as string,
    },
  });
  useSnackbarError(error);
  const group = useMemo(
    () => (data?.node?.__typename === "Group" ? data.node : null),
    [data]
  );

  const [tab, setTab] = useState("members");

  if (loading || !group) {
    return (
      <Stack flex={1} alignItems="center" justifyContent="center">
        <title>{`OBGS | Group loading ...`}</title>
        <CircularProgress />
      </Stack>
    );
  }

  if (!group) {
    return (
      <Container>
        <title>{`OBGS | Group not found`}</title>
        <Alert severity="error" icon={<ErrorIcon />}>
          Group not found
        </Alert>
      </Container>
    );
  }

  return (
    <Box>
      <title>{`OBGS | ${group.name}`}</title>
      <Card showSettings group={group} />

      <TabContext value={tab}>
        <TabList onChange={(_, t) => setTab(t)}>
          <Tab label="Members" value="members" />
        </TabList>

        <TabPanel value="members">
          <Members groupId={group.id} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default Group;
