const Joi = require('joi');
const message = require('./message');

module.exports.validateUser = (user) => {
    const joischema = Joi.object({
        username: Joi.string().min(4).max(15).required().message("Username must be a string of length between 4 to 15 characters."),
        cmp_id: Joi.number().integer(),
        email: Joi.string().email().required().message("Enter a valid email"),
        password: Joi.string().min(4).required().message("Password must have a minimum length of 4 characters"),
        first_name: Joi.string().min(4),
        last_name: Joi.string().min(1),
        gender: Joi.string().valid('male', 'female', 'transgeder', 'others').required().message("Gender should be one the following: male, female, transgender and others"),
        birth_date: Joi.date()
    }).options({ abortEarly: false });

    return joischema.validate(user);
}

module.exports.validateCompay = (company) => {
    const cmpschema = Joi.object({
        name: Joi.string().min(4).max(30).required().message("Name must be a string of length between 4 to 30 characters."),
        industry: Joi.string().required(),
        founded_date: Joi.date(),
        website: Joi.string().required(),
        email: Joi.string().email().required().message("Enter a valid email"),
        cmp_address: Joi.string().required(),
        cmp_phone: Joi.string()
    }).options({ abortEarly: false });
    return cmpschema.validate(company);
}

module.exports.validateUpdate = (update) => {
    const updateSchema = Joi.object({
        user_id: Joi.number().integer(),
        username: Joi.string().min(4).max(15).required().message("Username must be a string of length between 4 to 15 characters."),
        cmp_id: Joi.number().integer(),
        email: Joi.string().email().required().message("Enter a valid email"),
        password: Joi.string().min(4).required().message("Password must have a minimum length of 4 characters"),
        first_name: Joi.string().min(4),
        last_name: Joi.string().min(1),
        gender: Joi.string().valid('male', 'female', 'transgeder', 'others').required().message("Gender should be one the following: male, female, transgender and others"),
        birth_date: Joi.date(),
        name: Joi.string().min(4).max(30).required().message("Name must be a string of length between 4 to 30 characters."),
        industry: Joi.string().required(),
        founded_date: Joi.date(),
        website: Joi.string().required(),
        email: Joi.string().email().required().message("Enter a valid email"),
        cmp_address: Joi.string().required(),
        cmp_phone: Joi.string()
    }).options({ abortEarly: false });
    return updateSchema.validate(update);
}