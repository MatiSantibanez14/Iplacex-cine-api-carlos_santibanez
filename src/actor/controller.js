import { ObjectId } from "mongodb";
import { getCollection } from "../common/db.js";

const ACTOR_COLLECTION = "actores";

// post actor (valida nombre pelicula)
export async function handleInsertActorRequest(req, res) {
  try {
    const { nombrePelicula, nombre, edad, estaRetirado, premios } = req.body || {};
    if (!nombrePelicula || !nombre || typeof edad !== "number" || typeof estaRetirado !== "boolean" || !Array.isArray(premios)) {
      return res.status(400).json({
        message: "Campos requeridos: nombrePelicula, nombre, edad(int), estaRetirado(bool), premios[]"
      });
    }
    const peli = await getCollection("peliculas").findOne({ nombre: nombrePelicula });
    if (!peli) return res.status(404).json({ message: "Película no existe (validación por nombre)" });

    const doc = {
      idPelicula: String(peli._id),
      nombre,
      edad,
      estaRetirado,
      premios
    };
    const result = await getCollection(ACTOR_COLLECTION).insertOne(doc);
    return res.status(201).json({ _id: result.insertedId, ...doc });
  } catch (err) {
    return res.status(500).json({ message: "Error al insertar actor", error: String(err) });
  }
}

// get actores
export async function handleGetActoresRequest(_req, res) {
  try {
    const data = await getCollection(ACTOR_COLLECTION).find({}).toArray();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: "Error al obtener actores", error: String(err) });
  }
}

// get actor id
export async function handleGetActorByIdRequest(req, res) {
  try {
    const { id } = req.params;
    let _id;
    try { _id = new ObjectId(id); }
    catch { return res.status(400).json({ message: "Id mal formado" }); }

    const doc = await getCollection(ACTOR_COLLECTION).findOne({ _id });
    if (!doc) return res.status(404).json({ message: "No encontrado" });
    return res.status(200).json(doc);
  } catch (err) {
    return res.status(500).json({ message: "Error al obtener actor", error: String(err) });
  }
}

// get actor pelicula pelicula id (actores por id de pelicula)
export async function handleGetActoresByPeliculaIdRequest(req, res) {
  try {
    const { peliculaId } = req.params;
    let _id;
    try { _id = new ObjectId(peliculaId); }
    catch { return res.status(400).json({ message: "Id de película mal formado" }); }

    const data = await getCollection(ACTOR_COLLECTION).find({ idPelicula: String(_id) }).toArray();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: "Error al obtener actores por película", error: String(err) });
  }
}
