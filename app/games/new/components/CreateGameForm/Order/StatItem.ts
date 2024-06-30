import { StatDescriptionStatType } from "graphql/generated";

export type StatItem = {
  name: string;
  id: string;
  index: number;
  type: string;
  statType: StatDescriptionStatType;
  details?: React.ReactNode;
};
