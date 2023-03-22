import { StatDescriptionStatType } from "graphql/generated";

export const statTypeLabelMap: Record<StatDescriptionStatType, string> = {
  [StatDescriptionStatType.Enum]: "Enum",
  [StatDescriptionStatType.Numeric]: "Numeric",
  [StatDescriptionStatType.Aggregate]: "Aggregate",
};
