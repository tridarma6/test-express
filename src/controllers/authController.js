const authService = require('../services/authService');

class AuthController {
    async register(req, res, next) {
        try {
            const { name, email, password, role } = req.body;
            const user = await authService.register({ name, email, password, role });
            
            res.status(201).json({
                message: 'User registered successfully',
                user
            });
        } catch (error) {
            if (error.message === 'Email already registered') {
                return res.status(409).json({ error: error.message });
            }
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await authService.login({ email, password });
            
            res.json({
                message: 'Login successful',
                ...result
            });
        } catch (error) {
            if (error.message === 'Invalid credentials') {
                return res.status(401).json({ error: error.message });
            }
            next(error);
        }
    }

    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const result = await authService.refreshToken(refreshToken);
            
            res.json({
                message: 'Token refreshed successfully',
                ...result
            });
        } catch (error) {
            if (error.message === 'Invalid refresh token') {
                return res.status(401).json({ error: error.message });
            }
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const result = await authService.logout(refreshToken);
            
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();