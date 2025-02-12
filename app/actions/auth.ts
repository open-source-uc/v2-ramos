"use server";

import { cookies } from "next/headers";

import { SeverAPIClient } from "../api/RPC";

export async function ActionLogin(
  prev: {
    errors: number;
    success: number;
    message: string;
    body: {
      email: string;
      password: string;
    };
  },
  formData: FormData,
) {
  const body = {
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
  };

  const res = await SeverAPIClient.auth.login.$post({
    json: body,
  });

  if (res.status === 400) {
    const data = await res.json();
    return {
      errors: prev.errors + 1,
      success: 0,
      message: data.message,
      body: body,
    };
  }

  if (res.status === 200) {
    const data = await res.json();
    const cookieStore = await cookies();
    cookieStore.set("token", data.token);

    return {
      errors: 0,
      success: prev.success + 1,
      message: "Login success",
      body: body,
    };
  }
  if (res.status === 401) {
    const data = await res.json();
    return {
      errors: prev.errors + 1,
      success: 0,
      message: data.message,
      body: body,
    };
  }

  if (res.status === 500) {
    return {
      errors: prev.errors + 1,
      success: 0,
      message: "Internal server error",
      body: body,
    };
  }

  return {
    errors: prev.errors + 1,
    success: 0,
    message: "Unknown error",
    body: body,
  };
}

export async function ActionRegister(prev: any, formData: FormData) {
  const body = {
    nickname: formData.get("nickname")?.toString() ?? "",
    admission_year: parseInt(formData.get("admission_year")?.toString() ?? "0"),
    password: formData.get("password")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    career_id: parseInt(formData.get("career_id")?.toString() ?? "0"),
  };

  const res = await SeverAPIClient.auth.register.$post({
    json: body,
  });

  if (res.status === 400) {
    const data = await res.json();
    return {
      errors: prev.errors + 1,
      success: 0,
      message: data.message,
      body: body,
    };
  }

  if (res.status === 201) {
    const data = await res.json();
    const cookieStore = await cookies();
    cookieStore.set("token", data.token);

    return {
      errors: 0,
      success: prev.success + 1,
      message: "Login success",
      body: body,
    };
  }

  if (res.status === 500) {
    return {
      errors: prev.errors + 1,
      success: 0,
      message: "Internal server error",
      body: body,
    };
  }

  return {
    errors: prev.errors + 1,
    success: 0,
    message: "Unknown error",
    body: body,
  };
}
