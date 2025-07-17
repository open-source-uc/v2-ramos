# BuscaRamos

BuscaRamos es una plataforma creada por y para estudiantes de la Pontificia Universidad Católica de Chile (UC), diseñada para revolucionar la forma en que la comunidad universitaria explora, compara e inscribe cursos.

El objetivo principal es empoderar a los estudiantes con información real, transparente y útil sobre los ramos, permitiendo tomar decisiones informadas y colaborativas.

---

## 🚀 Instalación Rápida

1. **Instala dependencias:**

   ```bash
   npm install
   # o pnpm install
   ```

2. **Configura variables de entorno:**
   - Copia `.env.local.example` a `.env.local` y edítalo según tu entorno.
3. **Ejecuta migraciones:**

   ```bash
   cd migration
   bash setup-DANGER.sh
   bash setup-articles.sh
   cd ..
   ```

4. **Inicia el servidor de desarrollo:**

   ```bash
   npm run dev
   # o pnpm dev
   ```

   La app estará disponible en [http://localhost:4321](http://localhost:4321).

---

## 🧞 Comandos Básicos

| Comando           | Acción                                                    |
| :---------------- | :-------------------------------------------------------- |
| `npm install`     | Instala las dependencias.                                 |
| `npm run dev`     | Inicia el servidor de desarrollo en `localhost:4321`.     |
| `npm run build`   | Compila el sitio para producción en la carpeta `./dist/`. |
| `npm run preview` | Previsualiza la build de producción localmente.           |

---

## 📖 Documentación Completa

La documentación detallada (guías, preguntas frecuentes, contribución, funcionamiento de reviews, etc.) está disponible tanto en la carpeta [`/src/content/docs/`](./src/content/docs/) como en [Documentación Online](https://buscaramos.osuc.dev/resources/documentation).

- [Preguntas Frecuentes (FAQ)](./src/content/docs/faq.mdx)
- [Guía de Instalación](./src/content/docs/instalaccion.mdx)
- [Cómo Contribuir](./src/content/docs/contribuir.mdx)
- [Funcionamiento Detallado de las Reviews](./src/content/docs/reviews.mdx)

Para dudas específicas, revisa la documentación interna o abre un issue.

---

## 🤝 Contribuciones

¡Toda la comunidad puede aportar! Lee la [guía de contribución](./src/content/docs/contribuir.mdx) antes de enviar tu PR.

---

## 📄 Licencia

Distribuido bajo licencia MIT.
