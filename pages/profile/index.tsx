import styled from "@emotion/styled";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo } from "react";

import {
  useUpdateUserMutation,
  useGetFileUploadUrlLazyQuery,
  MeQuery,
  MeDocument,
} from "../../graphql/generated";
import useUser from "../../utils/user/useUser";

const Input = styled(TextField)`
  margin: 10px 0;
`;

const Profile = () => {
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

  const [file, setFile] = React.useState<File | null>(null);

  const [getUploadURL, { loading: getFileUploadURLLoading }] =
    useGetFileUploadUrlLazyQuery({
      onCompleted: async (data) => {
        if (!data || !file) return;
        const response = await fetch(data.getFileUploadURL, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });
        if (response.ok) {
          setValues({
            ...values,
            avatarURL: data.getFileUploadURL.split("?")[0],
          });
        }
      },
    });

  const operationLoading = useMemo(
    () => updateLoading || getFileUploadURLLoading,
    [updateLoading, getFileUploadURLLoading]
  );

  const handleAvatarChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;
      setFile(f);
      getUploadURL();
    },
    [getUploadURL]
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
            <label htmlFor="upload-avatar">
              <Avatar
                sx={{
                  width: 200,
                  height: 200,
                  "&:hover": {
                    cursor: "pointer",
                    background: "rgba(0, 0, 0, 0.5)",
                  },
                }}
              >
                {values.avatarURL ? (
                  <Image src={values.avatarURL} alt="avatar" layout="fill" />
                ) : (
                  <AccountCircle
                    sx={{
                      width: 200,
                      height: 200,
                    }}
                    color="inherit"
                  />
                )}
              </Avatar>
              <input
                style={{ display: "none" }}
                type="file"
                id="upload-avatar"
                name="upload-avatar"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </label>
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

export default Profile;
