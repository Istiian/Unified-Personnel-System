import dotenv from 'dotenv';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

dotenv.config();

if (!process.env.DATABASE_URL) {
    console.warn('Warning: DATABASE_URL is not set. pg Pool may fail to connect.');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });