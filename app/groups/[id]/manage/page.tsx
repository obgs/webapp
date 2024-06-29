import { Container, Typography } from "@mui/material";
import { Metadata } from "next";
import React from "react";

import Applications from "@/groups/components/Applications";
import Members from "@/groups/components/Members";
import Settings from "@/groups/components/Settings";
import TabView from "components/TabView";
import {
  GroupDocument,
  GroupQuery,
  GroupQueryVariables,
} from "graphql/generated";
import { Title } from "modules/nav";
import { createClient } from "utils/apollo/server";

interface Props {
  params: {
    id: string;
  };
}

export const generateMetadata = async ({
  params: { id },
}: Props): Promise<Metadata> => {
  if (!id) {
    return {
      title: "OBGS | Invalid group",
    };
  }

  const client = createClient();
  const res = await client.query<GroupQuery, GroupQueryVariables>({
    query: GroupDocument,
    variables: { id },
  });
  if (res.data.node?.__typename !== "Group") {
    return {
      title: `OBGS | Invalid group`,
    };
  }

  return {
    title: `OBGS | Manage ${res.data.node.name}`,
  };
};

const ManageGroup: React.FC<Props> = ({ params: { id } }) => {
  if (typeof id !== "string") {
    return (
      <Container>
        <Title text="Group settings" />
        <Typography variant="body1">Invalid URL</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <TabView
        values={["members", "applications", "settings"]}
        labels={["Members", "Applications", "Settings"]}
      >
        <Members manage groupId={id} />
        <Applications groupId={id} />
        <Settings groupId={id} />
      </TabView>
    </Container>
  );
};

export default ManageGroup;
