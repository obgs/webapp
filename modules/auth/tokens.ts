"use server";

import { cookies } from "next/headers";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const saveTokens = async ({ accessToken, refreshToken }: Tokens) => {
  cookies().set({
    name: "accessToken",
    value: accessToken,
    httpOnly: true,
  });
  cookies().set({
    name: "refreshToken",
    value: refreshToken,
    httpOnly: true,
  });
};

export const loadTokens = async () => {
  const { value: accessToken } = cookies().get("accessToken") || {};
  const { value: refreshToken } = cookies().get("refreshToken") || {};
  return accessToken && refreshToken ? { accessToken, refreshToken } : null;
};

export const clearTokens = async () => {
  cookies().delete("accessToken");
  cookies().delete("refreshToken");
};
