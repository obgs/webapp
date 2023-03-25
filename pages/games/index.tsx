import type { NextPage } from "next";

import Title from "components/Title";
import { Browse } from "modules/games";

const BrowseGames: NextPage = () => (
  <Title text="Browse games">
    <Browse />
  </Title>
);
export default BrowseGames;
