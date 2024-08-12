import { Autocomplete, AutocompleteProps, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

import {
  useSearchPlayersLazyQuery,
  PlayerFieldsFragment,
} from "graphql/generated";
import { useSnackbarError } from "utils/apollo";
import { useUser } from "utils/user";

interface Props
  extends Omit<
    AutocompleteProps<
      PlayerFieldsFragment | null | undefined,
      false,
      false,
      false
    >,
    "onChange" | "options" | "renderInput"
  > {
  onChange: (value: PlayerFieldsFragment) => void;
}

const PlayerAutocomplete: React.FC<Props> = ({ onChange, ...rest }) => {
  const [search, { data, loading, error }] = useSearchPlayersLazyQuery();
  useSnackbarError(error);

  const [value, setValue] = useState<PlayerFieldsFragment | null>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (value) {
      onChange(value);
    }
  }, [value, onChange]);

  const { user } = useUser();
  useEffect(() => {
    if (!inputValue || !user) return;
    search({
      variables: {
        where: {
          and: [
            {
              or: [
                { nameContains: inputValue },
                { hasOwnerWith: [{ nameContains: inputValue }] },
              ],
            },
            {
              or: [
                { hasOwnerWith: [{ id: user.id }] },
                { hasSupervisorsWith: [{ id: user.id }] },
              ],
            },
          ],
        },
        first: 10,
      },
    });
  }, [inputValue, search, user]);

  const options = data?.players.edges?.map((e) => e?.node) ?? [];

  return (
    <Autocomplete
      renderInput={(params) => <TextField label="Player" {...params} />}
      getOptionLabel={(option) => (option?.name || option?.owner?.name) ?? ""}
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

export default PlayerAutocomplete;
