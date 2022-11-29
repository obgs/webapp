import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Container, Tab, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";

import GroupSettings from "../../../components/groups/manage/Settings";

const ManageGroup = () => {
  const router = useRouter();
  const { id } = router.query;
  const [tab, setTab] = useState("settings");

  if (typeof id !== "string") {
    return (
      <Container>
        <Typography variant="body1">Invalid URL</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <TabContext value={tab}>
        <TabList onChange={(_, t) => setTab(t)}>
          <Tab label="Settings" value="settings" />
          <Tab label="Applications" value="applications" />
          <Tab label="Invites" value="invites" />
          <Tab label="Members" value="members" />
        </TabList>

        <TabPanel value="settings">
          <GroupSettings groupId={id} />
        </TabPanel>
        <TabPanel value="applications">Applications</TabPanel>
        <TabPanel value="invites">Invites</TabPanel>
        <TabPanel value="members">Members</TabPanel>
      </TabContext>
    </Container>
  );
};

export default ManageGroup;
