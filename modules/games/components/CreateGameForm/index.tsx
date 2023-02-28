import * as yup from "yup";

import { StatDescriptionStatType } from "graphql/generated";
const minPlayers = 1;
const maxPlayers = 10;

const statsValidation = yup.object({
  name: yup.string().required("Name is required"),
  type: yup.mixed().oneOf(Object.values(StatDescriptionStatType)),
  description: yup.string(),
  possibleValuesInput: yup.string(),
  possibleValues: yup.array().of(yup.string()).optional(),
});

export const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().optional(),
  minPlayers: yup
    .number()
    .min(minPlayers)
    .required("Minimum players is required"),
  maxPlayers: yup
    .number()
    .max(maxPlayers)
    .required("Maximum players is required"),
  boardgamegeekURL: yup.string().url("Must be a valid URL").optional(),
  statDescriptions: yup.array().of(statsValidation).required(),
});

export type FormValues = yup.InferType<typeof validationSchema>;

export const defaultValues: FormValues = {
  name: "",
  description: "",
  minPlayers,
  maxPlayers,
  boardgamegeekURL: "",
  statDescriptions: [
    {
      name: "",
      type: StatDescriptionStatType.Numeric,
      description: "",
      possibleValuesInput: "",
      possibleValues: [],
    },
  ],
};
