import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import Link from "next/link";
import React from "react";
import PersonIcon from "@mui/icons-material/Person";

const NavBar = () => {
  return (
    <List>
      <Link href="/players" passHref>
        <ListItem>
          <ListItemButton>
            <PersonIcon />
            <ListItemText primary="Players" />
          </ListItemButton>
        </ListItem>
      </Link>
    </List>
  );
};

export default NavBar;
