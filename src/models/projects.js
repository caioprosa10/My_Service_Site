import pool from './db.js';

export async function getProjects() {
    try {
        const sql = "SELECT * FROM projects ORDER BY project_name";
        const result = await pool.query(sql);
        return result.rows;
    } catch (error) {
        console.error("Erro ao buscar projetos:", error);
        throw error;
    }
}