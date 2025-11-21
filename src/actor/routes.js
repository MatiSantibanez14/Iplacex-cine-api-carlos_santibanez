import { Router } from "express";
import {
  handleInsertActorRequest,
  handleGetActoresRequest,
  handleGetActorByIdRequest,
  handleGetActoresByPeliculaIdRequest
} from "./controller.js";

const actorRoutes = Router();

// post actor
actorRoutes.post("/actor", handleInsertActorRequest);

// get actores
actorRoutes.get("/actores", handleGetActoresRequest);

// get actor id
actorRoutes.get("/actor/:id", handleGetActorByIdRequest);

// get actor pelicula pelicula id
actorRoutes.get("/actor/pelicula/:peliculaId", handleGetActoresByPeliculaIdRequest);

export default actorRoutes;
