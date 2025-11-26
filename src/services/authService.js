const bcrypt = require('bcrypt');
const userRepository = require('../models/userRepository');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/tokenUtils');

class AuthService {
    async register({ name, email, password, role }) {
        // Check if user already exists
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await userRepository.createUser({
            name,
            email,
            password: hashedPassword,
            role
        });

        return user;
    }

    async login({ email, password }) {
        // Find user by email
        const user = await userRepository.findByEmail(email);
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
            const decoded = verifyRefreshToken(refreshToken);
            
            // Verify user still exists
            const user = await userRepository.findById(decoded.id);
            if (!user) {
                throw new Error('User not found');
            }

            // Generate new access token
            const payload = { id: user.id, role: user.role };
            const accessToken = generateAccessToken(payload);

            return { accessToken };
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
}

module.exports = new AuthService();