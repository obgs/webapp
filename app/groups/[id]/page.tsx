import { Metadata } from "next";

import Group from "./Group";
import {
  GroupDocument,
  GroupQuery,
  GroupQueryVariables,
} from "graphql/generated";
import { createClient } from "utils/apollo/server";

type Props = {
  params: { id: string };
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const id = params.id;
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
    title: `OBGS | ${res.data.node.name}`,
  };
};

const GroupPage = () => {
  return <Group />;
};

export default GroupPage;
