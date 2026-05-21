import pool from '../db.js';

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
export async function getOrganizationById(id) {
    try {
        const sql = "SELECT * FROM organizations WHERE organization_id = $1";
        const result = await pool.query(sql, [id]);
        return result.rows[0];
    } catch (error) {
        console.error("Erro ao buscar organização por ID:", error);
        throw error;
    }
}