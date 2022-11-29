import { LoadingButton } from "@mui/lab";
import {
  Box,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import * as yup from "yup";

import { ImageInput, useImageInput } from "../../components/ImageInput";
import {
  GroupMembershipRole,
  GroupSettingsJoinPolicy,
  GroupSettingsVisibility,
  SearchGroupsDocument,
  useCreateOrUpdateGroupMutation,
} from "../../graphql/generated";
import useSnackbarError from "../../utils/apollo/useSnackbarError";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string(),
  logoURL: yup.string().required("Logo is required"),
  visibility: yup.mixed().oneOf(Object.values(GroupSettingsVisibility)),
  joinPolicy: yup.mixed().oneOf(Object.values(GroupSettingsJoinPolicy)),
  minimumRoleToInvite: yup.mixed().oneOf(Object.values(GroupMembershipRole)),
});

type FormValues = yup.InferType<typeof validationSchema>;

const defaultValues: FormValues = {
  name: "",
  description: "",
  logoURL: "",
  visibility: GroupSettingsVisibility.Public,
  joinPolicy: GroupSettingsJoinPolicy.Open,
  minimumRoleToInvite: GroupMembershipRole.Member,
};

export type SubmitCallback = (values: FormValues) => Promise<void>;

interface Props {
  buttonLabel: string;
  onSubmit: SubmitCallback;
  id?: string;
  initialValues?: FormValues;
}

const GroupForm: React.FC<Props> = ({
  buttonLabel,
  onSubmit,
  id,
  initialValues = defaultValues,
}) => {
  const [createOrUpdateGroup, { loading, error }] =
    useCreateOrUpdateGroupMutation();
  useSnackbarError(error);

  const { handleChange, setFieldValue, handleSubmit, values, errors, touched } =
    useFormik({
      validationSchema,
      initialValues,
      onSubmit: async () => {
        await createOrUpdateGroup({
          variables: {
            id,
            name: values.name,
            description: values.description,
            logoUrl: values.logoURL,
            visibility: values.visibility,
            joinPolicy: values.joinPolicy,
            minimumRoleToInvite: values.minimumRoleToInvite,
          },
          // updating the cache manually would be harder, so we just refetch the whole list
          refetchQueries: [
            {
              query: SearchGroupsDocument,
              variables: { where: {}, first: 10 },
            },
          ],
        });
        onSubmit(values);
      },
    });

  const { onChange, url: logoURL } = useImageInput({
    value: initialValues.logoURL,
  });

  useEffect(() => {
    if (values.logoURL === logoURL) return;
    setFieldValue("logoURL", logoURL);
  }, [logoURL, setFieldValue, values.logoURL]);

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Typography variant="body1">General</Typography>
        <Stack direction="row" spacing={2}>
          <Box>
            <FormLabel>Logo</FormLabel>
            <ImageInput existingAvatarURL={logoURL} onChange={onChange} />
            {touched.logoURL && errors.logoURL && (
              <FormHelperText error>{errors.logoURL}</FormHelperText>
            )}
          </Box>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={values.name}
              onChange={handleChange}
              name="name"
              error={touched.name && !!errors.name}
              helperText={touched.name && errors.name}
            />
            <TextField
              multiline
              label="Description (optional)"
              value={values.description}
              onChange={handleChange}
              name="description"
            />
          </Stack>
        </Stack>

        <Typography variant="body1">Settings</Typography>
        <FormLabel>Visibility</FormLabel>
        <FormHelperText>
          If the group is public, it can appear in searches. Private groups are
          only visible to their members.
        </FormHelperText>
        <FormControlLabel
          label="Public"
          control={
            <Switch
              checked={values.visibility === GroupSettingsVisibility.Public}
              onChange={(e) => {
                setFieldValue(
                  "visibility",
                  e.target.checked
                    ? GroupSettingsVisibility.Public
                    : GroupSettingsVisibility.Private
                );
              }}
            />
          }
        />

        <FormLabel>How to join the group?</FormLabel>
        <RadioGroup
          value={values.joinPolicy}
          onChange={handleChange}
          name="joinPolicy"
        >
          <FormControlLabel
            value={GroupSettingsJoinPolicy.Open}
            label="Anyone can join at any time"
            control={<Radio />}
          />
          <FormControlLabel
            value={GroupSettingsJoinPolicy.ApplicationOnly}
            label="By application"
            control={<Radio />}
          />
          <FormControlLabel
            value={GroupSettingsJoinPolicy.InviteOnly}
            label="Members of this group can invite other users"
            control={<Radio />}
          />
          <FormControlLabel
            value={GroupSettingsJoinPolicy.InviteOrApplication}
            label="Application or invite"
            control={<Radio />}
          />
        </RadioGroup>

        {(values.joinPolicy === GroupSettingsJoinPolicy.InviteOnly ||
          values.joinPolicy ===
            GroupSettingsJoinPolicy.InviteOrApplication) && (
          <>
            <FormLabel>
              Minimum role to invite other users to the group
            </FormLabel>
            <Box>
              <Select
                value={values.minimumRoleToInvite}
                name="minimumRoleToInvite"
                onChange={handleChange}
              >
                <MenuItem value={GroupMembershipRole.Member}>Member</MenuItem>
                <MenuItem value={GroupMembershipRole.Admin}>Admin</MenuItem>
                <MenuItem value={GroupMembershipRole.Owner}>Owner</MenuItem>
              </Select>
            </Box>
          </>
        )}
      </Stack>

      <Stack
        direction="row"
        justifyContent="flex-end"
        mt={2}
        alignSelf="flex-end"
      >
        <LoadingButton loading={loading} variant="contained" type="submit">
          {buttonLabel}
        </LoadingButton>
      </Stack>
    </form>
  );
};

export default GroupForm;
