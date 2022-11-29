import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Container, Tab, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";

import Members from "../../../components/groups/Members";
import GroupApplications from "../../../components/groups/manage/Applications";
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
          <Tab label="Members" value="members" />
        </TabList>

        <TabPanel value="settings">
          <GroupSettings groupId={id} />
        </TabPanel>
        <TabPanel value="applications">
          <GroupApplications groupId={id} />
        </TabPanel>
        <TabPanel value="members">
          <Members manage groupId={id} />
        </TabPanel>
      </TabContext>
    </Container>
  );
};

export default ManageGroup;
