import pool from '../db.js';

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
export async function getProjectById(id) {
    try {
        const sql = "SELECT * FROM projects WHERE project_id = $1";
        const result = await pool.query(sql, [id]);
        return result.rows[0];
    } catch (error) {
        console.error("Erro ao buscar projeto por ID:", error);
        throw error;
    }
}

export async function getProjectsByCategory(categoryId) {
    try {
        const sql = `
            SELECT p.* FROM projects p
            JOIN project_category pc ON p.project_id = pc.project_id
            WHERE pc.category_id = $1
        `;
        const result = await pool.query(sql, [categoryId]);
        return result.rows;
    } catch (error) {
        console.error("Erro ao buscar projetos da categoria:", error);
        throw error;
    }
}
export async function getProjectsByOrganization(orgId) {
    try {
        const sql = "SELECT * FROM projects WHERE organization_id = $1";
        const result = await pool.query(sql, [orgId]);
        return result.rows;
    } catch (error) {
        console.error("Erro ao buscar projetos da organização:", error);
        throw error;
    }
}