import { EnumMetadata } from "graphql/generated";

export const parseEnumMetadata = (metadata: string) => {
  const parsedMetadata = JSON.parse(metadata) as EnumMetadata;
  if (!parsedMetadata.possibleValues) {
    throw new Error("Invalid metadata");
  }
  return parsedMetadata;
};
