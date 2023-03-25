import type { NextPage } from "next";

import Title from "components/Title";
import { New } from "modules/matches";

const NewMatch: NextPage = () => (
  <Title text="New match">
    <New />
  </Title>
);

export default NewMatch;
