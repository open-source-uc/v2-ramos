import { hc } from "hono/client";
import { AppType } from "./index"
import { cookies } from "next/headers";

const OSUC_API_URL = process.env.OSUC_API_URL;
const OSUC_API_TOKEN = process.env.OSUC_API_TOKEN;


// Cliente para usar en las consultas del servidor, tipo para crear usuarios, hacer gets de la API, etc.
export const SeverAPIClient = hc<AppType>(OSUC_API_URL ?? 'http://localhost:8787/', {
    headers: {
        'Authorization': `Bearer ${OSUC_API_TOKEN}`,
        'X-User-Agent': 'hc',
    }
})

// Cliente para usar en las consultas del usuario, tipo para editar datos del usuario, ver sus reviews, ver su panel de usuario,
// cambiar su contraseña, crear reviews, etc.  
export const UserAPIClient = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get('osuctoken')

    if (!token) {
        throw new Error('No token found')
    }

    hc<AppType>(OSUC_API_URL ?? 'http://localhost:8787/', {
        headers: {
            'Authorization': `Bearer ${token.value}`,
            'X-User-Agent': 'hc',
        }
    })
} 
