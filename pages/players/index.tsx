import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";

import MyPlayers from "./MyPlayers";
import PendingSupervisionRequests from "./PendingSupervisionRequests";
import RequestSupervision from "./RequestSupervision";

const Players = () => {
  const [tab, setTab] = useState("my-players");

  const handleTabChange = useCallback(
    (_: unknown, newTab: string) => setTab(newTab),
    [setTab]
  );

  return (
    <Box>
      <Typography variant="body1">
        Players are the basic building blocks of you board game statistics.
        Users have a &quot;main player&quot; created for them as soon as they
        register with our app. This player is used to track <i>your</i>{" "}
        statistics. However, you can create other players for people that
        don&apos;t want to have an account at OBGS. These are called supervised
        players and all the management for them is done here.
      </Typography>
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleTabChange} aria-label="lab API tabs example">
            <Tab label="My Players" value="my-players" />
            <Tab label="Request supervision" value="request-supervision" />
            <Tab label="Pending requests" value="pending-requests" />
            <Tab label="Incoming requests" value="incoming-requests" />
          </TabList>
        </Box>
        <TabPanel value="my-players">
          <MyPlayers />
        </TabPanel>
        <TabPanel value="request-supervision">
          <RequestSupervision />
        </TabPanel>
        <TabPanel value="pending-requests">
          <PendingSupervisionRequests />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default Players;
