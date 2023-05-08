import type { NextPage } from "next";

import Title from "components/Title";
import { Browse } from "modules/players";

const BrowsePlayers: NextPage = () => (
  <Title text="Browse players">
    <Browse />
  </Title>
);

export default BrowsePlayers;
