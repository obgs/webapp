import type { NextPage } from "next";

import Title from "components/Title";
import { New } from "modules/games";

const NewGame: NextPage = () => (
  <Title text="New game">
    <New />
  </Title>
);

export default NewGame;
