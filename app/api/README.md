# Generación y uso de `AppType` en `api-ramos-uc`

Para compilar el tipo `AppType`, sigue estos pasos:

1. Ejecuta el siguiente comando en `api-ramos-uc` para generar solo las declaraciones de TypeScript:  

   ```sh
   tsc --declaration --emitDeclarationOnly
   ```

2. Una vez compilado, copia el archivo `index.d.ts` generado y pégalo en la carpeta `api`.

Con estos pasos, `AppType` estará disponible en la API para usar los clientes de server y usuario.

> [!IMPORTANT]  
> El archivo de entorno debe **llamarse** `.index.d.ts` y **DEBE** estar a la misma altura que `RPC.ts`