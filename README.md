# 📚 Proyecto Ramos UC

Este es un proyecto de estudiantes de la Pontificia Universidad Católica de Chile (UC) que busca revolucionar la forma en la que interactúa la comunidad estudiantil al momento de inscribir cursos.

## 🚀 Pasos para empezar

Para levantar el proyecto en tu máquina local, sigue estos pasos:

### 1. Instalar Dependencias

Primero, instala todas las dependencias del proyecto.

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto. Este archivo es **crucial** para que la aplicación funcione correctamente.

Copia y pega el siguiente contenido en tu archivo `.env.local`:

```env
MODE_ENV="development"

API_SECRET="tu_secreto_aqui"

# ¡IMPORTANTE! Este token es SOLO para desarrollo. Obtén este token desde el panel de Auth Osuc.
USER_TOKEN="tu_token_de_usuario_aqui"
```

**Notas:**
*   `API_SECRET`: Puedes usar un generador de contraseñas seguras para crear este valor.
*   `USER_TOKEN`: Este token es para simular un usuario autenticado en desarrollo. Asegúrate de no exponerlo.

### 3. Ejecutar las Migraciones

El siguiente paso es poblar tu base de datos local. El script `setup.sh` se encargará de todo.

Desde la raíz del proyecto, ejecuta:

```bash
bash migration/setup.sh
```

Cuando el script te pregunte, selecciona la opción **1) Local**.

### 4. Iniciar el Servidor de Desarrollo

¡Ya casi estás! Ahora, inicia el servidor de desarrollo de Astro.

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:4321`.

## 🧞 Comandos Disponibles

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando                   | Acción                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Instala las dependencias.                            |
| `npm run dev`             | Inicia el servidor de desarrollo en `localhost:4321`.      |
| `npm run build`           | Compila el sitio para producción en la carpeta `./dist/`.          |
| `npm run preview`         | Previsualiza tu compilación de producción localmente.     |

## 👀 ¿Quieres saber más?

Revisa la [documentación de Astro](https://docs.astro.build).
