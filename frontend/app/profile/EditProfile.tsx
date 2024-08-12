"use client";

import styled from "@emotion/styled";
import { LoadingButton } from "@mui/lab";
import { Box, CircularProgress, Container, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useMemo } from "react";

import { ImageInput, useImageInput } from "components/ImageInput";
import { useUpdateUserMutation, MeQuery, MeDocument } from "graphql/generated";
import { useUser } from "utils/user";

const Input = styled(TextField)`
  margin: 10px 0;
`;

const EditProfile = () => {
  const { user, loading: userLoading } = useUser();

  const [update, { loading: updateLoading }] = useUpdateUserMutation();

  const { values, setValues, handleSubmit, handleChange } = useFormik({
    initialValues: {
      email: "",
      name: "",
      avatarURL: "",
    },
    onSubmit: async (newValues) => {
      if (!user) return;
      update({
        variables: {
          id: user.id,
          input: {
            ...newValues,
          },
        },
        update: (cache) => {
          const cached = cache.readQuery<MeQuery>({
            query: MeDocument,
          });
          if (!cached) return;
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: {
                ...cached.me,
                ...newValues,
              },
            },
          });
        },
      });
    },
  });

  const {
    loading: getFileUploadURLLoading,
    onChange,
    url: avatarURL,
  } = useImageInput();

  useEffect(() => {
    if (values.avatarURL === avatarURL) return;
    setValues({
      ...values,
      avatarURL,
    });
  }, [avatarURL, setValues, values]);

  const operationLoading = useMemo(
    () => updateLoading || getFileUploadURLLoading,
    [updateLoading, getFileUploadURLLoading]
  );

  useEffect(() => {
    if (!user || userLoading) return;
    setValues({
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
    });
  }, [setValues, user, userLoading]);

  if (userLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
        pt={4}
      >
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
            }}
            mb={5}
          >
            <ImageInput
              onChange={onChange}
              existingAvatarURL={values.avatarURL}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
              ml={5}
            >
              <Input
                label="Name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
              />
            </Box>
          </Box>
          <Box>
            <LoadingButton
              loading={operationLoading}
              variant="contained"
              type="submit"
              sx={{ width: 100, p: 1 }}
            >
              Save
            </LoadingButton>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default EditProfile;
