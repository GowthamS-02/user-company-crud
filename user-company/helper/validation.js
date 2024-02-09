const Joi = require('joi');
const moment = require('moment');
let m = moment();

const validateUser = (user) => {
    const joischema = Joi.object({
        user_id: Joi.number().integer(),
        name: Joi.string().min(4).max(15).required(),
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

module.exports = validateUser;