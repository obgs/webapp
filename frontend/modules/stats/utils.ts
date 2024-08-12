import { StatDescriptionFieldsFragment } from "graphql/generated";

export const byOrderNumber = (
  a: StatDescriptionFieldsFragment,
  b: StatDescriptionFieldsFragment
) => {
  return a.orderNumber - b.orderNumber;
};
