const express = require('express');
const authController = require('../controllers/authController');
const { validate } = require('../middlewares/validationMiddleware');
const { registerSchema, loginSchema, refreshTokenSchema } = require('../validators/authValidator');

const router = express.Router();

// POST /auth/register
router.post('/register', validate(registerSchema), authController.register);

// POST /auth/login
router.post('/login', validate(loginSchema), authController.login);

// POST /auth/refresh
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);

module.exports = router;