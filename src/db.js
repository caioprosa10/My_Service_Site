import pkg from 'pg';
import dotenv from 'dotenv';

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
  console.error('Erro inesperado na base de dados:', err);
});

// A MÁGICA: Forçar a base de dados a corrigir-se sozinha
const buildDatabase = async () => {
    try {
        // 1. Cria as tabelas se elas não existirem
        const sqlCreate = `
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
                organization_description TEXT,
                organization_image VARCHAR(255)
            );

            CREATE TABLE IF NOT EXISTS projects (
                project_id SERIAL PRIMARY KEY,
                project_name VARCHAR(100) NOT NULL,
                project_description TEXT,
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
        await pool.query(sqlCreate);

        // 2. CORREÇÃO CRÍTICA: Força a base de dados a injetar as colunas caso o teu setup antigo se tenha esquecido delas!
        await pool.query("ALTER TABLE organizations ADD COLUMN IF NOT EXISTS organization_description TEXT DEFAULT 'Sem descrição';");
        await pool.query("ALTER TABLE organizations ADD COLUMN IF NOT EXISTS organization_image VARCHAR(255) DEFAULT 'org1.jpg';");
        await pool.query("ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_description TEXT DEFAULT 'Sem descrição';");

        console.log("SUCESSO: Base de dados atualizada e colunas corrigidas com sucesso!");
    } catch (error) {
        console.error("ERRO AO CORRIGIR TABELAS:", error.message);
    }
};

buildDatabase();

export default pool;