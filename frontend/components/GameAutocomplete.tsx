import {
  Autocomplete,
  AutocompleteProps,
  FormLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import {
  GameFieldsFragment,
  GameVersionFieldsFragment,
  useSearchGamesLazyQuery,
} from "graphql/generated";
import { useSnackbarError } from "utils/apollo";

interface Props {
  gameInputProps?: Omit<
    AutocompleteProps<
      GameFieldsFragment | null | undefined,
      false,
      false,
      false
    >,
    "onChange" | "options" | "renderInput"
  >;
  onGameChange?: (value: GameFieldsFragment) => void;
  onVersionChange?: (value: GameVersionFieldsFragment) => void;
}

const GameAutocomplete: React.FC<Props> = ({
  onGameChange,
  onVersionChange,
  ...rest
}) => {
  const [search, { data, loading, error }] = useSearchGamesLazyQuery();
  useSnackbarError(error);

  const [game, setGame] = useState<GameFieldsFragment | null>(null);
  const [version, setVersion] = useState<GameVersionFieldsFragment | null>(
    null
  );
  const [gameInput, setGameInputValue] = useState("");

  useEffect(() => {
    game && onGameChange?.(game);
    version && onVersionChange?.(version);
  }, [game, version, onGameChange, onVersionChange]);

  useEffect(() => {
    search({
      variables: {
        where: {
          nameContains: gameInput,
        },
        first: 10,
      },
    });
  }, [gameInput, search]);

  const options = data?.games.edges?.map((e) => e?.node) ?? [];

  return (
    <>
      <FormLabel>Game</FormLabel>
      <Autocomplete
        renderInput={(params) => <TextField {...params} />}
        getOptionLabel={(option) => option?.name ?? ""}
        loading={loading}
        options={options}
        onInputChange={(_, newInputValue) => {
          setGameInputValue(newInputValue);
        }}
        onChange={(_, newValue) => {
          setGame(newValue ?? null);
          setVersion(newValue?.versions?.[0] ?? null);
        }}
        isOptionEqualToValue={(option) => option?.id === game?.id}
        autoComplete
        {...rest}
      />
      {game && (
        <>
          <FormLabel>Version</FormLabel>
          <Select
            value={version?.id}
            onChange={(e) => {
              const newVersion = game.versions.find(
                (v) => v.id === e.target.value
              );
              setVersion(newVersion ?? null);
            }}
          >
            {game.versions.map((v) => (
              <MenuItem key={v.id} value={v.id}>
                {v.versionNumber}
              </MenuItem>
            ))}
          </Select>
        </>
      )}
    </>
  );
};

export default GameAutocomplete;
