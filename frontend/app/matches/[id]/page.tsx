import { Container, Typography } from "@mui/material";

import MatchView from "@/matches/components/MatchView";
import {
  MatchDocument,
  MatchQuery,
  MatchQueryVariables,
} from "graphql/generated";
import { getClient } from "utils/apollo/client.rsc";

interface Props {
  params: {
    id: string;
  };
}

export const generateMetadata = ({ params: { id } }: Props) => {
  return {
    title: `Match ${id}`,
  };
};

const MatchPage = async ({ params: { id } }: Props) => {
  const { data } = await getClient().query<MatchQuery, MatchQueryVariables>({
    query: MatchDocument,
    variables: {
      id,
    },
  });

  if (data?.node?.__typename !== "Match") {
    return <Typography>Match not found</Typography>;
  }

  return (
    <Container>
      <MatchView match={data.node} />
    </Container>
  );
};

export default MatchPage;
