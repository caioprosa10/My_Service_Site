import pool from './src/db.js'; // Ajuste o caminho se o seu db.js estiver em outro lugar

const setupDatabase = async () => {
    try {
        const sql = `
            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                user_name VARCHAR(255) NOT NULL,
                user_email VARCHAR(255) UNIQUE NOT NULL,
                user_password VARCHAR(255) NOT NULL,
                user_role VARCHAR(50) DEFAULT 'user'
            );
        `;
        await pool.query(sql);
        console.log("✅ Tabela 'users' criada com sucesso no banco de dados!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Erro ao criar tabela:", error);
        process.exit(1);
    }
};

setupDatabase();