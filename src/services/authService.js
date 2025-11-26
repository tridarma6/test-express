const bcrypt = require('bcrypt');
const db = require('../config/db');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/tokenUtils');

class AuthService {
    async register({ name, email, password, role }) {
        // Check if user already exists
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows[0]) {
            throw new Error('Email already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const result = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at',
            [name, email, hashedPassword, role]
        );

        return result.rows[0];
    }

    async login({ email, password }) {
        // Find user by email
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        // Generate tokens
        const payload = { id: user.id, role: user.role };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        // Store refresh token in database
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        await db.query(
            'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
            [user.id, refreshToken, expiresAt]
        );

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken
        };
    }

    async refreshToken(refreshToken) {
        try {
            // Verify token exists in database and not expired
            const tokenResult = await db.query(
                'SELECT rt.*, u.role FROM refresh_tokens rt JOIN users u ON rt.user_id = u.id WHERE rt.token = $1 AND rt.expires_at > NOW()',
                [refreshToken]
            );
            
            const tokenRecord = tokenResult.rows[0];
            if (!tokenRecord) {
                throw new Error('Invalid or expired refresh token');
            }

            // Verify JWT token
            const decoded = verifyRefreshToken(refreshToken);
            
            // Generate new access token
            const payload = { id: tokenRecord.user_id, role: tokenRecord.role };
            const accessToken = generateAccessToken(payload);

            return { accessToken };
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    async logout(refreshToken) {
        // Remove refresh token from database
        await db.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
        return { message: 'Logged out successfully' };
    }
}

module.exports = new AuthService();