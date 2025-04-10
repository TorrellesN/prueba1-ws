import { MongoClient, Collection, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGO_URL || "mongodb://localhost:27017";
const dbName = process.env.MONGO_DB_NAME || "prueba4";
const collections: { [key: string]: Collection } = {};

async function createMongoConnectionDefault() {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    await addCollections(db);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

let client: MongoClient;
async function createMongoConnection() {
  try {
    client = await MongoClient.connect(url);
    const db = client.db(dbName);
    await addCollections(db);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

const addCollections = (db: Db) => {
  collections.cafes = db.collection(
    process.env.MONGO_DB_COLLECTION_CAFES || "tabla1"
  );

};



const addIndexes = () => {
  collections.prueba1.createIndex({campo: 1},{unique: true});
} 

async function closeMongoConnection() {
  if (client) {
    await client.close();
    console.log(" MongoDB connection closed");
  }
}

export default createMongoConnection;
export { collections, closeMongoConnection , createMongoConnectionDefault};