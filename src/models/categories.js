import pool from '../db.js';

export async function getCategories() {
    try {
        const sql = "SELECT * FROM categories ORDER BY category_name";
        const result = await pool.query(sql);
        return result.rows;
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        throw error;
    }
}