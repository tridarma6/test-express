const db = require('../config/db');

class UserRepository {
    async findByEmail(email) {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    async findById(id) {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }

    async createUser({ name, email, password, role = 'user' }) {
        const result = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at',
            [name, email, password, role]
        );
        return result.rows[0];
    }

    async getAllUsers() {
        const result = await db.query(
            'SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY created_at DESC'
        );
        return result.rows;
    }

    async updateUser(id, data) {
        const fields = [];
        const values = [];
        let paramCount = 1;

        Object.keys(data).forEach(key => {
            if (data[key] !== undefined) {
                fields.push(`${key} = $${paramCount}`);
                values.push(data[key]);
                paramCount++;
            }
        });

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        values.push(id);
        const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING id, name, email, role, created_at, updated_at`;
        
        const result = await db.query(query, values);
        return result.rows[0];
    }

    // Hard delete - removes user completely from database
    async deleteUser(id) {
        const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
        return result.rows[0];
    }
}

module.exports = new UserRepository();