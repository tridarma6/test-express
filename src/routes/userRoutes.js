const express = require('express');
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const { updateUserSchema, userIdSchema } = require('../validators/userValidator');

const router = express.Router();

// GET /users/me - Get current user profile
router.get('/me', authenticate, userController.getCurrentUser);

// GET /users - Get all users (admin only)
router.get('/', authenticate, authorizeRoles('admin'), userController.getAllUsers);

// GET /users/:id - Get specific user (admin only)
router.get('/:id', validate(userIdSchema, 'params'), authenticate, authorizeRoles('admin'), userController.getUserById);

// PATCH /users/:id - Update user (admin only)
router.patch('/:id', validate(userIdSchema, 'params'), validate(updateUserSchema), authenticate, authorizeRoles('admin'), userController.updateUser);

// DELETE /users/:id - Delete user (admin only)
router.delete('/:id', validate(userIdSchema, 'params'), authenticate, authorizeRoles('admin'), userController.deleteUser);

module.exports = router;