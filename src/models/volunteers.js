import pool from '../db.js';

export const addVolunteer = async (userId, projectId) => {
    try {
        const sql = "INSERT INTO volunteers (user_id, project_id) VALUES ($1, $2)";
        await pool.query(sql, [userId, projectId]);
    } catch (error) {
        console.error("Erro ao adicionar voluntário:", error);
        throw error;
    }
};

export const removeVolunteer = async (userId, projectId) => {
    try {
        const sql = "DELETE FROM volunteers WHERE user_id = $1 AND project_id = $2";
        await pool.query(sql, [userId, projectId]);
    } catch (error) {
        console.error("Erro ao remover voluntário:", error);
        throw error;
    }
};

export const checkVolunteer = async (userId, projectId) => {
    try {
        const sql = "SELECT * FROM volunteers WHERE user_id = $1 AND project_id = $2";
        const result = await pool.query(sql, [userId, projectId]);
        return result.rowCount > 0;
    } catch (error) {
        console.error("Erro ao verificar voluntário:", error);
        throw error;
    }
};

export const getVolunteeredProjects = async (userId) => {
    try {
        // Removido o "ORDER BY" para evitar falhas se a coluna da data não existir na sua base de dados
        const sql = `
            SELECT p.* FROM projects p
            JOIN volunteers v ON p.project_id = v.project_id
            WHERE v.user_id = $1
        `;
        const result = await pool.query(sql, [userId]);
        return result.rows;
    } catch (error) {
        console.error("Erro ao buscar projetos do voluntário:", error);
        throw error;
    }
};