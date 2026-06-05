import pool from '../db.js';

export const getOrganizations = async () => {
    try {
        const sql = "SELECT * FROM organizations ORDER BY organization_name";
        const result = await pool.query(sql);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

export const getOrganizationById = async (id) => {
    try {
        const sql = "SELECT * FROM organizations WHERE organization_id = $1";
        const result = await pool.query(sql, [id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const insertOrganization = async (name, description, image) => {
    try {
        const sql = "INSERT INTO organizations (organization_name, organization_description, organization_image) VALUES ($1, $2, $3) RETURNING *";
        const result = await pool.query(sql, [name, description, image]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const updateOrganization = async (id, name, description, image) => {
    try {
        // BLINDAGEM 1: Garante que o ID é um número. Se chegar vazio, avisa no log.
        const numericId = parseInt(id);
        if (isNaN(numericId)) {
            console.error("ERRO DE ROTA: O ID da organização não chegou no Model!");
        }

        // BLINDAGEM 2: Corta o link da imagem se for maior que 255 caracteres para o banco não recusar.
        const safeImage = image ? image.substring(0, 255) : 'org1.jpg';

        // BLINDAGEM 3: Mostra exatamente o que estamos mandando pro banco lá no log do Render.
        console.log("DADOS CHEGANDO NO BANCO PARA UPDATE:", { numericId, name, safeImage });

        const sql = "UPDATE organizations SET organization_name = $1, organization_description = $2, organization_image = $3 WHERE organization_id = $4";
        return await pool.query(sql, [name, description, safeImage, numericId]);
    } catch (error) {
        // Se o banco recusar, o motivo exato vai aparecer em vermelho no log!
        console.error("ERRO EXATO DO BANCO DE DADOS:", error.message);
        throw error;
    }
};