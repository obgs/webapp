import type { NextPage } from "next";

import Title from "components/Title";
import { Browse } from "modules/matches";

const BrowseMatches: NextPage = () => (
  <Title text="Browse matches">
    <Browse />
  </Title>
);

export default BrowseMatches;
