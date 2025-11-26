const Joi = require('joi');

const logoutSchema = Joi.object({
    refreshToken: Joi.string().required()
});

module.exports = { logoutSchema };