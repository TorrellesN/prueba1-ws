import colors from 'colors';
import dotenv from "dotenv";
import { Collection, Db, MongoClient } from "mongodb";
import { exit } from 'node:process';



dotenv.config();

const url = process.env.MONGO_URL || "mongodb://localhost:27017";
const dbName = process.env.MONGO_DB_NAME || "prueba";
const collections: { [key: string]: Collection } = {};

async function createMongoConnectionDefault() {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    await addCollections(db);
    console.log(colors.cyan.bold("Connected to MongoDB"));
  } catch (error) {
    console.log( colors.red.bold('Error al conectar a MongoDB') )
        exit(1)
  }
}

let client: MongoClient;
async function createMongoConnection() {
  try {
    client = await MongoClient.connect(url);
    const db = client.db(dbName);
    await addCollections(db);
    console.log(colors.cyan.bold("Connected to MongoDB"));
  } catch (error) {
      console.log( colors.red.bold('Error al conectar a MongoDB') )
        exit(1)
  }
}

const addCollections = (db: Db) => {
  collections.users = db.collection(
    process.env.MONGO_DB_COLLECTION_USERS || "tabla1"
  );

};



const addIndexes = () => {
  collections.users.createIndex({campo: 1},{unique: true});
} 

async function closeMongoConnection() {
  if (client) {
    await client.close();
    console.log(" MongoDB connection closed");
  }
}

export default createMongoConnection;
export { closeMongoConnection, collections, createMongoConnectionDefault };

