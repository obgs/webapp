import type { NextPage } from "next";

import Title from "components/Title";
import { New } from "modules/groups";

const NewGroup: NextPage = () => (
  <Title text="New group">
    <New />
  </Title>
);

export default NewGroup;
