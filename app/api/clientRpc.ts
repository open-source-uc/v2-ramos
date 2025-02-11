import { hc } from "hono/client";
import { AppType } from "./index"
/*
En la misma carpeta que esta este repo instalar el api-ramos-uc,
para asi tener el AppType disponible.

NO OLVIDAR TAMBIEN HACER `pnpm install` en la carpeta del repo de 'api-ramos-uc'
*/
const OSUC_API_URL = process.env.OSUC_API_URL;
const OSUC_API_TOKEN = process.env.OSUC_API_TOKEN;

const Client = hc<AppType>('http://localhost:8787/')

export default Client;