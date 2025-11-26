const db = require('../config/db');
const bcrypt = require('bcrypt');

class UserService {
    async getCurrentUser(userId) {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = result.rows[0];
        if (!user) {
            throw new Error('User not found');
        }

        // Return user without password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async getAllUsers() {
        const result = await db.query(
            'SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY created_at DESC'
        );
        return result.rows;
    }

    async getUserById(id) {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        const user = result.rows[0];
        if (!user) {
            throw new Error('User not found');
        }

        // Return user without password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async updateUser(id, updateData) {
        // If password is being updated, hash it
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 12);
        }

        const fields = [];
        const values = [];
        let paramCount = 1;

        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                fields.push(`${key} = $${paramCount}`);
                values.push(updateData[key]);
                paramCount++;
            }
        });

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        values.push(id);
        const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING id, name, email, role, created_at, updated_at`;
        
        const result = await db.query(query, values);
        const updatedUser = result.rows[0];
        if (!updatedUser) {
            throw new Error('User not found');
        }

        return updatedUser;
    }

    async deleteUser(id) {
        const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
        const deletedUser = result.rows[0];
        if (!deletedUser) {
            throw new Error('User not found');
        }

        return { message: 'User deleted successfully' };
    }
}

module.exports = new UserService();