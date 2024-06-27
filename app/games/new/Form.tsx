"use client";

import { Card } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React, { useCallback, useState } from "react";

import {
  collectStatDescriptions,
  defaultValues,
  FormValues,
} from "./components/CreateGameForm";
import AggregateStats from "./components/CreateGameForm/AggregateStats";
import { AggregateStatsValues } from "./components/CreateGameForm/AggregateStats/schema";
import GeneralInformation, {
  GeneralInformationValues,
} from "./components/CreateGameForm/GeneralInformation";
import GenericStats from "./components/CreateGameForm/GenericStats";
import { GenericStatsValues } from "./components/CreateGameForm/GenericStats/schema";
import Order from "./components/CreateGameForm/Order";
import Preview from "./components/CreateGameForm/Preview";
import { SearchGamesDocument, useCreateGameMutation } from "graphql/generated";
import { useSnackbarError } from "utils/apollo";

const Form = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [create, { loading, error }] = useCreateGameMutation();
  useSnackbarError(error);

  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [values, setValues] = useState<FormValues>(defaultValues);
  const onSubmit = useCallback(async () => {
    await create({
      variables: {
        input: {
          name: values.name,
          description: values.description,
          minPlayers: values.minPlayers,
          maxPlayers: values.maxPlayers,
          boardgamegeekURL: values.boardgamegeekURL,
          statDescriptions: collectStatDescriptions(values),
        },
      },
      refetchQueries: [
        {
          query: SearchGamesDocument,
          variables: { where: { nameContains: "" }, first: 10 },
        },
      ],
    });
    enqueueSnackbar(`Game ${values.name} created`, { variant: "success" });
    router.push("/games");
  }, [create, enqueueSnackbar, router, values]);

  const onGeneralInformationSubmit = useCallback(
    (generalInformationValues: GeneralInformationValues) => {
      setValues((v) => ({
        ...v,
        ...generalInformationValues,
      }));
      setActiveStep((s) => s + 1);
    },
    []
  );

  const onGenericStatsSubmit = useCallback(
    (genericStatsValues: GenericStatsValues) => {
      setValues((v) => ({
        ...v,
        ...genericStatsValues,
      }));
      setActiveStep((s) => s + 1);
    },
    []
  );

  const onAggregateStatsSubmit = useCallback(
    (aggregateStatsValues: AggregateStatsValues) => {
      setValues((v) => ({
        ...v,
        ...aggregateStatsValues,
      }));
      setActiveStep((s) => s + 1);
    },
    []
  );

  const onOrderSubmit = useCallback((orderValues: Record<string, number>) => {
    setValues((prev) => ({
      ...prev,
      genericStats: prev.genericStats.map((stat) => ({
        ...stat,
        orderNumber: orderValues[stat.id],
      })),
      aggregateStats: prev.aggregateStats.map((stat) => ({
        ...stat,
        orderNumber: orderValues[stat.id],
      })),
    }));
    setActiveStep((s) => s + 1);
  }, []);

  const goBack = useCallback(() => {
    setActiveStep((s) => s - 1);
  }, []);

  return (
    <Card sx={{ maxWidth: 600 }}>
      {activeStep === 0 && (
        <GeneralInformation
          values={values}
          onSubmit={onGeneralInformationSubmit}
        />
      )}
      {activeStep === 1 && (
        <GenericStats
          values={values}
          goBack={goBack}
          onSubmit={onGenericStatsSubmit}
        />
      )}
      {activeStep === 2 && (
        <AggregateStats
          values={values}
          goBack={goBack}
          onSubmit={onAggregateStatsSubmit}
        />
      )}
      {activeStep === 3 && (
        <Order values={values} goBack={goBack} onConfirm={onOrderSubmit} />
      )}
      {activeStep === 4 && (
        <Preview
          values={values}
          loading={loading}
          goBack={goBack}
          onSubmit={onSubmit}
        />
      )}
    </Card>
  );
};

export default Form;
