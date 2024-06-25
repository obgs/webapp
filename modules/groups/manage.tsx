import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Container, Tab, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";

import Applications from "./components/Applications";
import Members from "./components/Members";
import Settings from "./components/Settings";
import { Title } from "modules/nav";

const ManageGroup = () => {
  const router = useRouter();
  const { id } = router.query;
  const [tab, setTab] = useState("settings");

  if (typeof id !== "string") {
    return (
      <Container>
        <Title text="Group settings" />
        <Typography variant="body1">Invalid URL</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <TabContext value={tab}>
        <TabList onChange={(_, t) => setTab(t)}>
          <Tab label="Members" value="members" />
          <Tab label="Applications" value="applications" />
          <Tab label="Settings" value="settings" />
        </TabList>

        <TabPanel value="members">
          <Members manage groupId={id} />
        </TabPanel>
        <TabPanel value="applications">
          <Applications groupId={id} />
        </TabPanel>
        <TabPanel value="settings">
          <Settings groupId={id} />
        </TabPanel>
      </TabContext>
    </Container>
  );
};

export default ManageGroup;
