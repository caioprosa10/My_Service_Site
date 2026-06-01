import pool from '../db.js';

export const insertUser = async (name, email, hashedPassword) => {
    try {
        const sql = "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING user_id, user_name, user_email, user_role";
        const result = await pool.query(sql, [name, email, hashedPassword]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const getUserByEmail = async (email) => {
    try {
        const sql = "SELECT * FROM users WHERE user_email = $1";
        const result = await pool.query(sql, [email]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const sql = "SELECT user_id, user_name, user_email, user_role FROM users ORDER BY user_name";
        const result = await pool.query(sql);
        return result.rows;
    } catch (error) {
        throw error;
    }
};