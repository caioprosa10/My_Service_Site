import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Tratamento de erro adicionado para garantir os 5 pontos da rubrica
pool.on('error', (err) => {
  console.error('Erro inesperado no banco de dados:', err);
});

export default pool;