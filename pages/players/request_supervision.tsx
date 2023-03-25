import type { NextPage } from "next";

import Title from "components/Title";
import { RequestSupervision } from "modules/players";

const RequestPlayerSupervision: NextPage = () => (
  <Title text="Request player supervision">
    <RequestSupervision />
  </Title>
);

export default RequestPlayerSupervision;
