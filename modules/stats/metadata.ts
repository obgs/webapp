import { EnumMetadata } from "graphql/generated";

export const parseEnumMetadata = (metadata?: string | null) => {
  if (!metadata) {
    throw new Error("Metadata is required");
  }
  return JSON.parse(metadata) as EnumMetadata;
};
