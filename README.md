# Ramos UC

Este repositorio contiene el frontend de la aplicación web **Ramos UC**, una plataforma para compartir críticas y opiniones sobre los ramos de la universidad.

## Setup

Para configurar el proyecto, sigue estos pasos:

1. Instalar las dependencias:
   ```bash
   npm ci
   ```

2. Crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables de entorno:
> [!IMPORTANT]
> Debe llamarse **`.env.local`**
   ```env
   OSUC_API_URL= // Obligatorio en desarrollo y producción
   OSUC_API_TOKEN= // Obligatorio en desarrollo y producción
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Despliegue en Cloudflare

Si la web no se despliega correctamente en Cloudflare, puede ser debido a problemas con el linting.

1. Ejecuta el siguiente comando para corregir automáticamente los problemas de linting:
   ```bash
   npm run lint:fix
   ```

2. Si el problema persiste, intenta compilar la página para revisar los errores:
   ```bash
   npm run pages:build
   ```

Esto te permitirá identificar cualquier problema de compilación.

## Notas adicionales

- Asegúrate de tener configuradas correctamente las variables de entorno `OSUC_API_URL` y `OSUC_API_TOKEN` tanto en desarrollo como en producción para asegurar que la aplicación funcione correctamente.
