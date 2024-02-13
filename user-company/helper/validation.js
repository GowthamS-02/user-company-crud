const Joi = require('joi');

module.exports.validateUser = (user) => {
    const joischema = Joi.object({
        user_id: Joi.number().integer(),
        username: Joi.string().min(4).max(15).required(),
        cmp_id: Joi.number().integer(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).required(),
        first_name: Joi.string().min(4),
        last_name: Joi.string().min(4),
        gender: Joi.string().valid('male', 'female', 'transger', 'others').required(),
        birth_date: Joi.date().max('01-01-2005'),
    }).options({ abortEarly: false });

    return joischema.validate(user);
}

module.exports.validateCompay = (company) => {
    const cmpschema = Joi.object({
        cmp_id: Joi.number().integer().required(),
        name: Joi.string().min(4).max(30).required(),
        industry:  Joi.string().required(),
        founded_date: Joi.date(),
        website: Joi.string().required(),
        cmp_address: Joi.string().required(),
        cmp_phone: Joi.string()
    }).options({ abortEarly: false });
    return cmpschema.validate(company);
}