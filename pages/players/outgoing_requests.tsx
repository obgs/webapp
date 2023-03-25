import type { NextPage } from "next";

import Title from "components/Title";
import { OutgoingSupervisionRequests } from "modules/players";

const OutgoingRequests: NextPage = () => (
  <Title text="Outgoing supervision requests">
    <OutgoingSupervisionRequests />
  </Title>
);

export default OutgoingRequests;
