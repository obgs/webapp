import AccountCircle from "@mui/icons-material/AccountCircle";
import { Avatar } from "@mui/material";
import Image from "next/image";
import React, { useCallback, useState } from "react";

import { usePresignUploadUrlLazyQuery } from "graphql/generated";
import { useSnackbarError } from "utils/apollo";

interface Props {
  existingAvatarURL?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
}

export const useImageInput = (
  { value }: { value?: string } | undefined = { value: "" }
) => {
  const [url, setUrl] = useState(value || "");
  const [file, setFile] = useState<File | null>(null);
  const [getUploadURL, { loading, error }] = usePresignUploadUrlLazyQuery({
    onCompleted: async (data) => {
      if (!data || !file) return;
      const u = data.preSignUploadURL.url;
      const response = await fetch(u, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
          ...data.preSignUploadURL.headers.reduce((acc, { key, value: v }) => {
            acc[key] = v;
            return acc;
          }, {} as Record<string, string>),
        },
      });
      if (response.ok) {
        setUrl(u.split("?")[0]);
      }
    },
  });
  useSnackbarError(error);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;
      setFile(f);
      getUploadURL();
    },
    [getUploadURL]
  );

  return { url, onChange, loading };
};

export const ImageInput: React.FC<Props> = ({
  existingAvatarURL,
  onChange,
}) => {
  return (
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
        {existingAvatarURL ? (
          <Image src={existingAvatarURL} alt="avatar" />
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
        onChange={onChange}
      />
    </label>
  );
};
