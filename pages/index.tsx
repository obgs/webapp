import type { NextPage } from "next";

import Title from "components/Title";
import Home from "modules/home";

const HomePage: NextPage = () => (
  <Title text="Home">
    <Home />
  </Title>
);

export default HomePage;
