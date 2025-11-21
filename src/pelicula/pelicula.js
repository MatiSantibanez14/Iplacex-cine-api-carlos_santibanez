import { ObjectId } from "mongodb";

// Builder que construye una película con los tipos correctos
export function buildPeliculaFromBody(body) {
  const { nombre, genero, anioEstreno } = body;

  // genero debe ser array (la pauta lo pide)
  let generosArray = [];

  if (Array.isArray(genero)) {
    generosArray = genero;
  } else if (typeof genero === "string") {
    generosArray = genero
      .split(",")
      .map((g) => g.trim())
      .filter((g) => g.length > 0);
  }

  return {
    _id: new ObjectId(),
    nombre: String(nombre),
    genero: generosArray,         // array → sin tilde (corrección del profe)
    anioEstreno: Number(anioEstreno) // int
  };
}
