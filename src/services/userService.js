const userRepository = require('../models/userRepository');
const bcrypt = require('bcrypt');

class UserService {
    async getCurrentUser(userId) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Return user without password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async getAllUsers() {
        return await userRepository.getAllUsers();
    }

    async getUserById(id) {
        const user = await userRepository.findById(id);
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

        const updatedUser = await userRepository.updateUser(id, updateData);
        if (!updatedUser) {
            throw new Error('User not found');
        }

        return updatedUser;
    }

    async deleteUser(id) {
        const deletedUser = await userRepository.deleteUser(id);
        if (!deletedUser) {
            throw new Error('User not found');
        }

        return { message: 'User deleted successfully' };
    }
}

module.exports = new UserService();