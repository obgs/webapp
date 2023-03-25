import type { NextPage } from "next";

import Title from "components/Title";
import { Manage } from "modules/groups";

const ManageGroup: NextPage = () => (
  <Title text="Group settings">
    <Manage />
  </Title>
);
export default ManageGroup;
