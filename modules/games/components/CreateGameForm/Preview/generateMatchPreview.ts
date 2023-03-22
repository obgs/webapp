import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";

import { collectStatDescriptions, FormValues } from "..";
import {
  AggregateMetadataType,
  MatchFieldsFragment,
  StatDescriptionStatType,
} from "graphql/generated";
import { parseAggregateMetadata } from "modules/stats";

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const calculateAggregateStats = (
  stats: MatchFieldsFragment["stats"]
): MatchFieldsFragment["stats"] => {
  return (
    stats?.map((s) => {
      if (
        s.statDescription.type !== StatDescriptionStatType.Aggregate ||
        !s.statDescription.metadata
      )
        return s;

      const metadata = parseAggregateMetadata(s.statDescription.metadata);

      return {
        ...s,
        value: metadata.statIds
          .reduce((acc, id) => {
            const stat = stats.find(
              (sd) =>
                sd.statDescription.id === id && sd.player.id === s.player.id
            );
            if (!stat) return acc;
            if (stat.statDescription.type === StatDescriptionStatType.Numeric) {
              return acc + Number(stat.value);
            }
            return acc;
          }, 0)
          .toString(),
      };
    }) || []
  );
};

const generateMatchPreview = (values: FormValues): MatchFieldsFragment => {
  const statDescriptions = collectStatDescriptions(values).map((s) => ({
    ...s,
    id: nanoid(),
  }));
  const amountOfPlayers = random(values.minPlayers, values.maxPlayers);
  const players = new Array(amountOfPlayers).fill(0).map(() => ({
    id: nanoid(),
    name: faker.name.firstName(),
  }));

  const stats = calculateAggregateStats(
    players.flatMap((player) =>
      statDescriptions.map((s) => ({
        id: s.id,
        value:
          s.type === StatDescriptionStatType.Numeric
            ? random(0, 100).toString()
            : StatDescriptionStatType.Enum
            ? s.metadata?.enumMetadata?.possibleValues[
                random(0, s.metadata?.enumMetadata?.possibleValues.length - 1)
              ] || ""
            : "",
        player: {
          id: player.id,
          name: player.name,
        },
        statDescription: {
          ...s,
          metadata:
            s.type === StatDescriptionStatType.Enum
              ? JSON.stringify(s.metadata)
              : s.type === StatDescriptionStatType.Aggregate
              ? JSON.stringify({
                  type: AggregateMetadataType.Sum,
                  statIds: s.metadata?.aggregateMetadata?.statOrderNumbers.map(
                    (n) => statDescriptions[n - 1].id
                  ),
                })
              : undefined,
        },
      }))
    )
  );

  return {
    id: "1",
    game: {
      id: "1",
      name: values.name,
      minPlayers: values.minPlayers,
      maxPlayers: values.maxPlayers,
      favorites: {
        total: 0,
        users: [],
      },
      isFavorite: false,
      statDescriptions: statDescriptions.map((s) => ({
        id: s.id,
        name: s.name,
        type: s.type,
      })),
      author: {
        id: "1",
        name: "Author name",
        email: "author@obgs.app",
        avatarURL: faker.image.avatar(),
      },
    },
    players,
    stats,
  };
};

export default generateMatchPreview;
