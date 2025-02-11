"use server";
import { cookies } from "next/headers";

export async function createUser(prev: any, formData: FormData) {
  const body = {
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
    nickname: formData.get("nickname")?.toString() ?? "",
    admission_year: parseInt(formData.get("admission_year")?.toString() || "") || "",
    carrer_name: formData.get("carrer_name")?.toString() ?? "",
  };
  const OSUC_API_URL = process.env.OSUC_API_URL;
  if (!OSUC_API_URL) {
    return {
      errors: prev.errors + 1,
      success: 0,
      message: "API URL not set",
      data: body,
    };
  }

  const response = await fetch(`${OSUC_API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log("hola");
    return {
      errors: prev.errors + 1,
      success: 0,
      message: data.message,
      data: body,
    };
  }
  console.log(data);
  return {
    errors: 0,
    success: 1,
    message: data.message,
    data: body,
  };
}

export async function loginUser(prev: any, formData: FormData) {
  const body = {
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
  };

  const OSUC_API_URL = process.env.OSUC_API_URL;
  if (!OSUC_API_URL) {
    return {
      errors: prev.errors + 1,
      success: 0,
      message: "API URL not set",
      data: body,
    };
  }

  const response = await fetch(`${OSUC_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      errors: prev.errors + 1,
      success: 0,
      message: data.message,
      data: body,
    };
  }
  const cookieStore = await cookies();

  await cookieStore.set("osuctoken", data.token);

  return {
    errors: 0,
    success: 1,
    message: data.message,
    data: body,
  };
}
