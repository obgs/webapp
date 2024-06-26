import { UrlObject } from "url";

import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { PropsWithChildren } from "react";

interface Props {
  href: string | UrlObject;
  icon?: React.ReactNode;
  "data-cy"?: string;
}

const NavLink = ({
  href,
  children,
  icon,
  "data-cy": dataCy,
}: PropsWithChildren<Props>) => {
  const path = usePathname();

  return (
    <ListItem>
      <ListItemButton
        component={Link}
        href={href}
        data-cy={dataCy}
        selected={href === path}
      >
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText primary={children} />
      </ListItemButton>
    </ListItem>
  );
};

export default NavLink;
