import pool from '../db.js';

// --- A MÁGICA AUTOCURÁVEL ---
// Esta função roda sozinha quando o servidor liga e garante que a coluna exista!
const garantirColunaNoBanco = async () => {
    try {
        await pool.query("ALTER TABLE organizations ADD COLUMN IF NOT EXISTS organization_image VARCHAR(255);");
        console.log("Sucesso: Coluna organization_image garantida no banco de dados!");
    } catch (error) {
        console.log("Aviso: " + error.message);
    }
};
garantirColunaNoBanco();
// -----------------------------

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
        const sql = "UPDATE organizations SET organization_name = $1, organization_description = $2, organization_image = $3 WHERE organization_id = $4";
        return await pool.query(sql, [name, description, image, id]);
    } catch (error) {
        throw error;
    }
};