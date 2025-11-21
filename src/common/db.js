import { MongoClient } from "mongodb";

let client;
let db;

const DB_NAME = "cine-db";


const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://ev3_express:FsogthvtYAl6IpbC@cluster-express.yudooml.mongodb.net/?appName=cluster-express";

export async function connectToDB() {
  if (db) return db;
  client = new MongoClient(MONGODB_URI);
  await client.connect();        
  db = client.db(DB_NAME);
  return db;
}

export function getDB() {
  if (!db) throw new Error("BD no inicializada: llama a connectToDB() primero.");
  return db;
}

export function getCollection(name) {
  return getDB().collection(name);
}
