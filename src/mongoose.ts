import mongoose from "mongoose";
import { Db } from "mongodb";

export async function initDb(): Promise<Db> {
  const MONGO_DB_URI = process.env["MONGO_DB_URI"] as string;

  mongoose.set("strictQuery", true);

  const { db, host, name, port } = (await mongoose.connect(MONGO_DB_URI))
    .connection;

  console.log(
    `Database connnection success! mongodb://${host}:${port}/${name}`
  );

  return db;
}
