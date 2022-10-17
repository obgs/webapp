import { UrlObject } from "url";

import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { PropsWithChildren } from "react";

interface Props {
  href: string | UrlObject;
  icon?: React.ReactNode;
}

const NavLink = ({ href, children, icon }: PropsWithChildren<Props>) => {
  const { route } = useRouter();

  return (
    <Link href={href} passHref>
      <ListItem>
        <ListItemButton selected={href === route}>
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          <ListItemText primary={children} />
        </ListItemButton>
      </ListItem>
    </Link>
  );
};

export default NavLink;
