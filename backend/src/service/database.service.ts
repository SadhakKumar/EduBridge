import { MongoClient, Db, Collection, GridFSBucket, ObjectId } from "mongodb";
import Grid from "gridfs-stream";
import dotenv from "dotenv";
import { student } from "../models/student";
import { teacher } from "../models/teacher";

dotenv.config();

export const collection: {
  students?: Collection<student>;
  teachers?: Collection<teacher>;
  gridfs?: Grid.Grid;
} = {};

export let gridfsBucket: GridFSBucket;

export async function connectToDatabase() {
  // Create a new MongoDB client with the connection string from .env and Connect to it
  const client: MongoClient = await MongoClient.connect(
    process.env.MONGO_DB_URL || ""
  ).catch((err) => {
    console.log(err);
    throw new Error("Could not connect to database");
  });

  // Connect to the database with the name specified in .env
  const db: Db = client.db(process.env.MONGO_DB_NAME);
  gridfsBucket = new GridFSBucket(db);
  collection.students = db.collection<student>("students");
  collection.teachers = db.collection<teacher>("teachers");
  console.log("Connected to database");
}
