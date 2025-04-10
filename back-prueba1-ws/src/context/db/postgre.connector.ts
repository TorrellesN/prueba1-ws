import dotenv from "dotenv";
import {Pool} from "pg";
dotenv.config();

const dbHost = process.env.POSTGRES_HOST || 'localhost';
const dbUser = process.env.POSTGRES_USER;
const dbPassword = process.env.POSTGRES_PW;
const dbName = process.env.POSTGRES_DB;
const port = process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432;



const pool = new Pool({
  max: 1000,
  user: dbUser,
  password: dbPassword,
  host: dbHost,
  database: dbName,
  port: port,
  ssl: process.env.POSTGRES_PORT ? { rejectUnauthorized: false } : undefined
});


const executeQuery = async (sql: any, data?: any[]): Promise<any[]> => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(sql, data);

    return rows;
  } catch (error) {
    console.error("Error de ejecución de la query. ", error);
    throw error;
  } finally {
    client.release();
  }
}

export default executeQuery;