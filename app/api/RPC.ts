import { cookies } from "next/headers";

import { hc } from "hono/client";

import { AppType } from "./index";

const NEXT_PUBLIC_OSUC_API_URL = process.env.NEXT_PUBLIC_OSUC_API_URL;
const OSUC_API_TOKEN = process.env.OSUC_API_TOKEN;

// Cliente para usar en las consultas del servidor, tipo para crear usuarios, hacer gets de la API, etc.
export const ServerAPIClient = hc<AppType>(NEXT_PUBLIC_OSUC_API_URL ?? "http://localhost:8787/", {
  headers: {
    Authorization: `Bearer ${OSUC_API_TOKEN}`,
    "X-User-Agent": "hc",
  },
});

// Cliente para usar en las consultas del usuario, tipo para editar datos del usuario, ver sus reviews, ver su panel de usuario,
// cambiar su contraseña, crear reviews, etc.
export const UserAPIClient = async (token: string) => {
  "use client";

  const cookieStore = await cookies();

  if (!token) {
    throw new Error("No token found");
  }

  return hc<AppType>(NEXT_PUBLIC_OSUC_API_URL ?? "http://localhost:8787/", {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-User-Agent": "hc",
    },
  });
};
