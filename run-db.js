import fs from 'fs';
import pool from './src/db.js';

async function runSQL() {
    try {
        console.log("A ler o ficheiro setup.sql...");
        // Lê o ficheiro SQL que criaste na pasta src
        const sql = fs.readFileSync('./src/setup.sql', 'utf8');
        
        console.log("A enviar os comandos para o banco de dados no Render...");
        // Executa todo o código SQL de uma vez
        await pool.query(sql);
        
        console.log("🎉 SUCESSO! As tabelas foram criadas e os dados inseridos.");
        process.exit(0);
    } catch (error) {
        console.error("Erro ao executar o SQL:", error);
        process.exit(1);
    }
}

runSQL();