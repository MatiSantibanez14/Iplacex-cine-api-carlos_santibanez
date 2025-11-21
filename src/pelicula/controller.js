import { ObjectId } from "mongodb";
import { getCollection } from "../common/db.js";
import { buildPeliculaFromBody } from "./pelicula.js";

const COLLECTION = "peliculas";

// POST película
export async function handleInsertPeliculaRequest(req, res) {
  try {
    const { nombre, genero, anioEstreno } = req.body || {};

    // Validación básica de campos requeridos
    if (!nombre || genero === undefined || anioEstreno === undefined) {
      return res.status(400).json({
        message: "Campos requeridos: nombre, genero(array o string), anioEstreno"
      });
    }

    // Construcción del documento con tipos correctos
    const pelicula = buildPeliculaFromBody(req.body);

    const result = await getCollection(COLLECTION).insertOne(pelicula);

    return res.status(201).json({
      message: "Película creada correctamente",
      _id: result.insertedId,
      ...pelicula
    });
  } catch (err) {
    return res.status(500).json({ message: "Error al insertar película", error: String(err) });
  }
}

// GET todas las películas
export async function handleGetPeliculasRequest(_req, res) {
  try {
    const data = await getCollection(COLLECTION).find({}).toArray();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: "Error al obtener películas", error: String(err) });
  }
}

// GET película por id
export async function handleGetPeliculaByIdRequest(req, res) {
  try {
    const { id } = req.params;
    let _id;
    try {
      _id = new ObjectId(id);
    } catch {
      return res.status(400).json({ message: "Id mal formado" });
    }

    const doc = await getCollection(COLLECTION).findOne({ _id });
    if (!doc) return res.status(404).json({ message: "No encontrado" });

    return res.status(200).json(doc);
  } catch (err) {
    return res.status(500).json({ message: "Error al obtener película", error: String(err) });
  }
}

// PUT película por id
export async function handleUpdatePeliculaByIdRequest(req, res) {
  try {
    const { id } = req.params;
    let _id;

    try {
      _id = new ObjectId(id);
    } catch {
      return res.status(400).json({ message: "Id mal formado" });
    }

    // Si está actualizando película, normalizamos tipos usando builder
    let updateDoc = req.body;

    // Si envía nombre, genero o anioEstreno, mejor reconstruir la película parcial
    if (updateDoc.nombre || updateDoc.genero || updateDoc.anioEstreno) {
      updateDoc = {
        ...(updateDoc.nombre && { nombre: String(updateDoc.nombre) }),
        ...(updateDoc.genero && {
          genero: Array.isArray(updateDoc.genero)
            ? updateDoc.genero
            : String(updateDoc.genero).split(",").map(g => g.trim())
        }),
        ...(updateDoc.anioEstreno && { anioEstreno: Number(updateDoc.anioEstreno) })
      };
    }

    const update = { $set: updateDoc };

    const result = await getCollection(COLLECTION).findOneAndUpdate(
      { _id },
      update,
      { returnDocument: "after" }
    );

    if (!result) return res.status(404).json({ message: "No encontrado" });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Error al actualizar película", error: String(err) });
  }
}

// DELETE película por id
export async function handleDeletePeliculaByIdRequest(req, res) {
  try {
    const { id } = req.params;
    let _id;
    try {
      _id = new ObjectId(id);
    } catch {
      return res.status(400).json({ message: "Id mal formado" });
    }

    const result = await getCollection(COLLECTION).deleteOne({ _id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No encontrado" });
    }

    return res.status(200).json({ message: "Eliminado" });
  } catch (err) {
    return res.status(500).json({ message: "Error al eliminar película", error: String(err) });
  }
}
