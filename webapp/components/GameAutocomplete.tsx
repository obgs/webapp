import { Autocomplete, AutocompleteProps, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

import { GameFieldsFragment, useSearchGamesLazyQuery } from "graphql/generated";
import { useSnackbarError } from "utils/apollo";

interface Props
  extends Omit<
    AutocompleteProps<
      GameFieldsFragment | null | undefined,
      false,
      false,
      false
    >,
    "onChange" | "options" | "renderInput"
  > {
  onChange: (value: GameFieldsFragment) => void;
}

const GameAutocomplete: React.FC<Props> = ({ onChange, ...rest }) => {
  const [search, { data, loading, error }] = useSearchGamesLazyQuery();
  useSnackbarError(error);

  const [value, setValue] = useState<GameFieldsFragment | null>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (value) {
      onChange(value);
    }
  }, [value, onChange]);

  useEffect(() => {
    if (!inputValue) return;

    search({
      variables: {
        where: {
          nameContains: inputValue,
        },
        first: 10,
      },
    });
  }, [inputValue, search]);

  const options = data?.games.edges?.map((e) => e?.node) ?? [];

  return (
    <Autocomplete
      renderInput={(params) => <TextField label="Game" {...params} />}
      getOptionLabel={(option) => option?.name ?? ""}
      loading={loading}
      options={options}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(_, newValue) => {
        setValue(newValue ?? null);
      }}
      isOptionEqualToValue={(option) => option?.id === value?.id}
      autoComplete
      {...rest}
    />
  );
};

export default GameAutocomplete;
