import pool from '../db.js';

export const getProjects = async () => {
    try {
        const sql = "SELECT * FROM projects ORDER BY project_name";
        const result = await pool.query(sql);
        return result.rows;
    } catch (error) {
        console.error("Erro ao buscar projetos:", error);
        throw error;
    }
};

export const getProjectById = async (id) => {
    try {
        const sql = "SELECT * FROM projects WHERE project_id = $1";
        const result = await pool.query(sql, [id]);
        return result.rows[0];
    } catch (error) {
        console.error("Erro ao buscar projeto por ID:", error);
        throw error;
    }
};

export const getProjectsByCategory = async (categoryId) => {
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
};

export const getProjectsByOrganization = async (orgId) => {
    try {
        const sql = "SELECT * FROM projects WHERE organization_id = $1";
        const result = await pool.query(sql, [orgId]);
        return result.rows;
    } catch (error) {
        console.error("Erro ao buscar projetos da organização:", error);
        throw error;
    }
};

export const insertProject = async (projectName, description, organizationId) => {
    try {
        const sql = "INSERT INTO projects (project_name, description, organization_id) VALUES ($1, $2, $3) RETURNING *";
        const result = await pool.query(sql, [projectName, description, organizationId]);
        return result.rows[0];
    } catch (error) {
        console.error("Erro ao inserir projeto:", error);
        throw error;
    }
};

export const updateProject = async (projectId, projectName, description, organizationId) => {
    try {
        const sql = "UPDATE projects SET project_name = $1, description = $2, organization_id = $3 WHERE project_id = $4 RETURNING *";
        const result = await pool.query(sql, [projectName, description, organizationId, projectId]);
        return result.rows[0];
    } catch (error) {
        console.error("Erro ao atualizar projeto:", error);
        throw error; 
    }
};

// --- FUNÇÕES NOVAS PARA ATENDER AO CRITÉRIO 3 (Adicionar/Remover Categorias do Projeto) ---

export const getProjectCategories = async (projectId) => {
    try {
        const sql = `
            SELECT c.* FROM categories c
            JOIN project_category pc ON c.category_id = pc.category_id
            WHERE pc.project_id = $1
        `;
        const result = await pool.query(sql, [projectId]);
        return result.rows;
    } catch (error) {
        console.error("Erro ao buscar categorias do projeto:", error);
        throw error;
    }
};

export const deleteProjectCategories = async (projectId) => {
    try {
        const sql = "DELETE FROM project_category WHERE project_id = $1";
        await pool.query(sql, [projectId]);
    } catch (error) {
        console.error("Erro ao deletar categorias do projeto:", error);
        throw error;
    }
};

export const insertProjectCategory = async (projectId, categoryId) => {
    try {
        const sql = "INSERT INTO project_category (project_id, category_id) VALUES ($1, $2)";
        await pool.query(sql, [projectId, categoryId]);
    } catch (error) {
        console.error("Erro ao inserir categoria no projeto:", error);
        throw error;
    }
};