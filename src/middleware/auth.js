import pkg from 'pg';
import dotenv from 'dotenv';

// CORREÇÃO DEFINITIVA: Desativa a verificação estrita de certificado auto-assinado.
// Isto resolve o erro do Render instantaneamente sem precisares de mexer no site deles!
process.env.PGSSLMODE = 'no-verify';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('error', (err) => {
  console.error('Erro inesperado no banco de dados:', err);
});

// Criar as tabelas automaticamente assim que o servidor ligar
const buildDatabase = async () => {
    try {
        const sql = `
            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                user_name VARCHAR(100) NOT NULL,
                user_email VARCHAR(100) UNIQUE NOT NULL,
                user_password VARCHAR(255) NOT NULL,
                user_role VARCHAR(50) DEFAULT 'Client'
            );

            CREATE TABLE IF NOT EXISTS organizations (
                organization_id SERIAL PRIMARY KEY,
                organization_name VARCHAR(100) NOT NULL,
                organization_description TEXT NOT NULL,
                organization_image VARCHAR(255)
            );

            CREATE TABLE IF NOT EXISTS projects (
                project_id SERIAL PRIMARY KEY,
                project_name VARCHAR(100) NOT NULL,
                project_description TEXT NOT NULL,
                organization_id INTEGER REFERENCES organizations(organization_id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS categories (
                category_id SERIAL PRIMARY KEY,
                category_name VARCHAR(100) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS project_categories (
                project_id INTEGER REFERENCES projects(project_id) ON DELETE CASCADE,
                category_id INTEGER REFERENCES categories(category_id) ON DELETE CASCADE,
                PRIMARY KEY (project_id, category_id)
            );
        `;
        await pool.query(sql);
        console.log("SUCESSO: Todas as tabelas foram verificadas e criadas no banco de dados!");
    } catch (error) {
        console.error("ERRO AO CRIAR TABELAS:", error.message);
    }
};

buildDatabase();

export default pool;