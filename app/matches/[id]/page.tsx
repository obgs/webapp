import { Container, Divider, Stack, Typography } from "@mui/material";

import MatchCharts from "@/matches/components/MatchCharts";
import MatchTable from "@/matches/components/MatchTable";
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
      <Stack spacing={2}>
        <Typography variant="h5">Charts</Typography>
        <MatchCharts match={data.node} />
        <Divider />
        <Typography variant="h5">Table</Typography>
        <MatchTable match={data.node} />
      </Stack>
    </Container>
  );
};

export default MatchPage;
