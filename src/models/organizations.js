import pool from './db.js';

export async function getOrganizations() {
    try {
        const sql = "SELECT * FROM organizations ORDER BY organization_name";
        const result = await pool.query(sql);
        return result.rows;
    } catch (error) {
        console.error("Erro ao buscar organizações:", error);
        throw error;
    }
}