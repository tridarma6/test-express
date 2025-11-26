const userService = require('../services/userService');

class UserController {
    async getCurrentUser(req, res, next) {
        try {
            const user = await userService.getCurrentUser(req.user.id);
            res.json({ user });
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).json({ error: error.message });
            }
            next(error);
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            res.json({ users });
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(parseInt(id));
            res.json({ user });
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).json({ error: error.message });
            }
            next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // Remove fields that shouldn't be updated directly
            delete updateData.id;
            delete updateData.created_at;
            delete updateData.updated_at;

            const user = await userService.updateUser(parseInt(id), updateData);
            res.json({
                message: 'User updated successfully',
                user
            });
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).json({ error: error.message });
            }
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            const result = await userService.deleteUser(parseInt(id));
            res.json(result);
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).json({ error: error.message });
            }
            next(error);
        }
    }
}

module.exports = new UserController();