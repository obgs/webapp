import type { NextPage } from "next";

import Title from "components/Title";
import { IncomingSupervisionRequests } from "modules/players";

const IncomingRequests: NextPage = () => (
  <Title text="Incoming supervision requests">
    <IncomingSupervisionRequests />
  </Title>
);

export default IncomingRequests;
