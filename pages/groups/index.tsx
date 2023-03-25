import type { NextPage } from "next";

import Title from "components/Title";
import { Browse } from "modules/groups";

const BrowseGroups: NextPage = () => (
  <Title text="Browse groups">
    <Browse />
  </Title>
);

export default BrowseGroups;
