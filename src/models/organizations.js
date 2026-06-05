import pool from '../db.js';

export const getOrganizations = async () => {
    try {
        const sql = "SELECT *, COALESCE(organization_image, image, '') AS organization_image FROM organizations ORDER BY organization_name";
        const result = await pool.query(sql);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

export const getOrganizationById = async (id) => {
    try {
        const sql = "SELECT *, COALESCE(organization_image, image, '') AS organization_image FROM organizations WHERE organization_id = $1";
        const result = await pool.query(sql, [id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const insertOrganization = async (name, description, image) => {
    try {
        // Tenta inserir usando a coluna padrão. Se der erro por falta da coluna, ele usa a coluna alternativa 'image'
        try {
            const sql = "INSERT INTO organizations (organization_name, organization_description, organization_image) VALUES ($1, $2, $3) RETURNING *";
            const result = await pool.query(sql, [name, description, image]);
            return result.rows[0];
        } catch (e) {
            const sqlAlt = "INSERT INTO organizations (organization_name, organization_description, image) VALUES ($1, $2, $3) RETURNING *, image AS organization_image";
            const resultAlt = await pool.query(sqlAlt, [name, description, image]);
            return resultAlt.rows[0];
        }
    } catch (error) {
        throw error;
    }
};

export const updateOrganization = async (id, name, description, image) => {
    try {
        // Tenta atualizar usando a coluna padrão. Se der erro, ele faz o update na coluna alternativa 'image'
        try {
            const sql = "UPDATE organizations SET organization_name = $1, organization_description = $2, organization_image = $3 WHERE organization_id = $4";
            return await pool.query(sql, [name, description, image, id]);
        } catch (e) {
            const sqlAlt = "UPDATE organizations SET organization_name = $1, organization_description = $2, image = $3 WHERE organization_id = $4";
            return await pool.query(sqlAlt, [name, description, image, id]);
        }
    } catch (error) {
        throw error;
    }
};