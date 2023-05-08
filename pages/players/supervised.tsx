import type { NextPage } from "next";

import Title from "components/Title";
import { Supervised } from "modules/players";

const SupervisedPlayers: NextPage = () => (
  <Title text="My players">
    <Supervised />
  </Title>
);

export default SupervisedPlayers;
