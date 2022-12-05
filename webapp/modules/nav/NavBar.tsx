import { List, ListSubheader } from "@mui/material";
import React from "react";

import NavLink from "./NavLink";
import { useAuth } from "modules/auth";

const NavBar = () => {
  const { authenticated } = useAuth();

  return (
    <List dense>
      <ListSubheader>OBGS</ListSubheader>
      <NavLink href="/">Home</NavLink>
      <ListSubheader>Players</ListSubheader>
      <NavLink href="/players">Browse</NavLink>
      {authenticated && (
        <>
          <NavLink href="/players/supervised">My players</NavLink>
          <NavLink href="/players/request_supervision">
            Request supervision
          </NavLink>
          <NavLink href="/players/incoming_requests">Incoming requests</NavLink>
          <NavLink href="/players/outgoing_requests">Outgoing requests</NavLink>
        </>
      )}
      <ListSubheader>Groups</ListSubheader>
      <NavLink href="/groups">Browse</NavLink>
    </List>
  );
};

export default NavBar;
