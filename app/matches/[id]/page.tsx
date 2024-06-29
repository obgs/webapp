import Match from "./Match";

interface Props {
  params: {
    id: string;
  };
}

export const generateMetadata = ({ params: id }: Props) => {
  return {
    title: `Match ${id}`,
  };
};

const MatchPage = () => <Match />;

export default MatchPage;
