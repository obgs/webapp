import { ApolloError } from "@apollo/client";
import { useSnackbar } from "notistack";
import { useEffect } from "react";

const useSnackbarError = (error?: ApolloError) => {
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    error && enqueueSnackbar(error.message, { variant: "error" });
  }, [error, enqueueSnackbar]);
};

export default useSnackbarError;
