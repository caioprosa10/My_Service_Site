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

export async function updateProjectCategories(projectId, categoryIds) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); 
        
        await client.query("DELETE FROM project_category WHERE project_id = $1", [projectId]);
        
        if (categoryIds && categoryIds.length > 0) {
            const insertSql = "INSERT INTO project_category (project_id, category_id) VALUES ($1, $2)";
            for (let categoryId of categoryIds) {
                await client.query(insertSql, [projectId, categoryId]);
            }
        }
        
        await client.query('COMMIT'); 
    } catch (error) {
        await client.query('ROLLBACK'); 
        console.error("Erro ao atualizar categorias do projeto:", error);
        throw error;
    } finally {
        client.release();
    }
}
export async function insertProject(projectName, description, organizationId) {
    try {
        const sql = "INSERT INTO projects (project_name, description, organization_id) VALUES ($1, $2, $3) RETURNING *";
        const result = await pool.query(sql, [projectName, description, organizationId]);
        return result.rows[0];
    } catch (error) {
        console.error("Erro ao inserir projeto:", error);
        throw error;
    }
}

export async function updateProject(projectId, projectName, description, organizationId) {
    try {
        const sql = "UPDATE projects SET project_name = $1, description = $2, organization_id = $3 WHERE project_id = $4 RETURNING *";
        const result = await pool.query(sql, [projectName, description, organizationId, projectId]);
        return result.rows[0];
    } catch (error) {
        console.error("Erro ao atualizar projeto:", error);
        throw error;
    }
}