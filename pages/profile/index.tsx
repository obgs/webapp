import type { NextPage } from "next";

import Title from "components/Title";
import Profile from "modules/profile";

const EditProfile: NextPage = () => (
  <Title text="Profile">
    <Profile />
  </Title>
);

export default EditProfile;
