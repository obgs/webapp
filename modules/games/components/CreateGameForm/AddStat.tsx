import AddCircleIcon from "@mui/icons-material/AddCircle";
import { IconButton } from "@mui/material";
import { useFormikContext } from "formik";
import React, { useCallback } from "react";

import { StatDescriptionStatType } from "graphql/generated";

import { FormValues } from ".";

const AddStat = () => {
  const { values, setValues } = useFormikContext<FormValues>();

  const addStat = useCallback(() => {
    setValues({
      ...values,
      statDescriptions: [
        ...values.statDescriptions,
        {
          name: "",
          type: StatDescriptionStatType.Numeric,
          description: "",
          possibleValuesInput: "",
          possibleValues: [],
          aggregateOrderNumbers: [],
        },
      ],
    });
  }, [setValues, values]);
  return (
    <IconButton onClick={addStat}>
      <AddCircleIcon />
    </IconButton>
  );
};

export default AddStat;
