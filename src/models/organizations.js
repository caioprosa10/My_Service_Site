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
export async function insertOrganization(organizationName) {
    try {
        const sql = "INSERT INTO organizations (organization_name) VALUES ($1) RETURNING *";
        const result = await pool.query(sql, [organizationName]);
        return result.rows[0];
    } catch (error) {
        console.error("Erro ao inserir organização:", error);
        throw error;
    }
}

export async function updateOrganization(orgId, organizationName) {
    try {
        const sql = "UPDATE organizations SET organization_name = $1 WHERE organization_id = $2 RETURNING *";
        const result = await pool.query(sql, [organizationName, orgId]);
        return result.rows[0];
    } catch (error) {
        console.error("Erro ao atualizar organização:", error);
        throw error;
    }
}