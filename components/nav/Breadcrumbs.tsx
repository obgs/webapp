import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Breadcrumbs as MUIBreadcrumbs } from "@mui/material";

interface Breadcrumb {
  breadcrumb: string;
  href: string;
}

const toTitleCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const Breadcrumbs = () => {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split("/");
      linkPath.shift();

      const pathArray = linkPath.map((path, i) => {
        return {
          breadcrumb: path,
          href: "/" + linkPath.slice(0, i + 1).join("/"),
        };
      });

      setBreadcrumbs(pathArray);
    }
  }, [router]);

  if (!breadcrumbs) {
    return null;
  }

  return (
    <MUIBreadcrumbs sx={{ color: "inherit" }}>
      <Link href="/" passHref>
        Home
      </Link>
      {breadcrumbs.map((breadcrumb, i) => (
        <Link href={breadcrumb.href} key={i}>
          {toTitleCase(breadcrumb.breadcrumb)}
        </Link>
      ))}
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs;
