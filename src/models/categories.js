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

export async function getCategoryById(id) {
    try {
        const sql = "SELECT * FROM categories WHERE category_id = $1";
        const result = await pool.query(sql, [id]);
        return result.rows[0]; 
    } catch (error) {
        console.error("Erro ao buscar categoria por ID:", error);
        throw error;
    }
}

export async function getCategoriesByProject(projectId) {
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
}

export async function insertCategory(categoryName) {
    try {
        const sql = "INSERT INTO categories (category_name) VALUES ($1) RETURNING *";
        const result = await pool.query(sql, [categoryName]);
        return result.rows[0];
    } catch (error) {
        console.error("Erro ao inserir categoria:", error);
        throw error;
    }
}

export async function updateCategory(categoryId, categoryName) {
    try {
        const sql = "UPDATE categories SET category_name = $1 WHERE category_id = $2 RETURNING *";
        const result = await pool.query(sql, [categoryName, categoryId]);
        return result.rows[0];
    } catch (error) {
        console.error("Erro ao atualizar categoria:", error);
        throw error;
    }
}