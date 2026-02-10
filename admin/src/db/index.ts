import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from './schema'; // Import your schema here

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL!,
});

// Pass the schema here to enable relational queries
export const db = drizzle(pool, { schema });