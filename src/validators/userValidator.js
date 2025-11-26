const Joi = require('joi');

const updateUserSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    role: Joi.string().valid('user', 'admin')
}).min(1);

const userIdSchema = Joi.object({
    id: Joi.number().integer().positive().required()
});

module.exports = {
    updateUserSchema,
    userIdSchema
};