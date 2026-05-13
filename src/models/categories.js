// Assumindo que você configurou a conexão do banco (pool) nas atividades da semana
import pool from '../db.js'; 

export async function getCategories() {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY category_name');
        return result.rows;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
}