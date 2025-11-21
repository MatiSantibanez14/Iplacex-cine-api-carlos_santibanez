import express from "express";
import cors from "cors";
import { connectToDB } from "./src/common/db.js";
import peliculaRoutes from "./src/pelicula/routes.js";
import actorRoutes from "./src/actor/routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta base
app.get("/", (_req, res) => {
  res.status(200).send("Bienvenido al cine Iplacex");
});

// Prefijo /api para las rutas del proyecto
app.use("/api", peliculaRoutes);
app.use("/api", actorRoutes);

// Ruta de healthcheck (buena práctica y útil para Render)
app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "cine-api" });
});

// Iniciar servidor SOLO si conecta a MongoDB Atlas
try {
  await connectToDB();
  console.log("✅ Conexión a MongoDB Atlas OK");

  app.listen(PORT, () => {
    console.log(`🚀 Servidor Express escuchando en http://localhost:${PORT}`);
  });
} catch (err) {
  console.error("❌ Error conectando a Atlas:", err);
  process.exit(1); // Finaliza si no conecta (pauta obligatoria)
}
