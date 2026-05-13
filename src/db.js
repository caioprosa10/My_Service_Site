import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Essa é a linha mágica que resolve o erro "no encryption"
    ssl: {
        rejectUnauthorized: false
    }
});

export default pool;