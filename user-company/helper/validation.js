const Joi = require('joi');
const message = require('./message');

let content = {
    name: Joi.string().min(4).max(50).required()
        .messages({
            'string.empty': 'Name cannot be empty',
            'string.min': 'Name should be minimum of 4 characters',
            'string.max': 'Name should be maximum of 50 characters',
        }),
    cmp_id: Joi.number().integer()
        .messages({
            'any.only': 'Enter data in numbers'
        }),
    email: Joi.string().email().required()
        .messages({
            'string.empty': 'Email cannot be empty',
            'string.email': 'Enter a valid email'
        }),
    password: Joi.string().min(4).required()
        .messages({
            'string.min': 'Password must have a minimum length of 4 characters'
        }),
    first_name: Joi.string().min(4)
        .messages({
            'string.min': 'Name should be minimum of 4 characters',
        }),
    last_name: Joi.string().min(1)
        .messages({
            'string.min': 'Name should be minimum of 1 characters',
        }),
    gender: Joi.string().valid('male', 'female', 'transgender', 'others').required()
        .messages({ 'any.only': 'Gender should be one the following: male, female, transgender and others' }),
    date: Joi.date()
        .messages({
            'any.only': 'Enter date in correct format'
        }),
    industry: Joi.string().required(),
    website: Joi.string().required(),
    cmp_address: Joi.string().required(),
    cmp_phone: Joi.string()
};

let optionalContent = {
    name: Joi.string().min(4).max(50)
        .messages({
            'string.min': 'Name should be minimum of 4 characters',
            'string.max': 'Name should be maximum of 50 characters'
        }),
    email: Joi.string().email().messages({ 'any.only': 'Enter a valid email' }),
    password: Joi.string().min(4)
        .messages({ 'any.only': 'Password must have a minimum length of 4 characters' }),
    gender: Joi.string().valid('male', 'female', 'transgender', 'others')
        .messages({ 'any.only': 'Gender should be one the following: male, female, transgender and others' }),
    industry: Joi.string(),
    website: Joi.string(),
    cmp_address: Joi.string()
}

module.exports.userSchema = Joi.object({
    username: content.name,
    cmp_id: content.cmp_id,
    email: content.email,
    password: content.password,
    first_name: content.first_name,
    last_name: content.last_name,
    gender: content.gender,
    birth_date: content.date
});
// return joischema.validate(user);

module.exports.cmpSchema = Joi.object({
    name: content.name,
    industry: content.industry,
    founded_date: content.date,
    website: content.website,
    email: content.email,
    cmp_address: content.cmp_address,
    cmp_phone: content.cmp_phone
})

module.exports.updateSchema = Joi.object({
    username: optionalContent.name,
    cmp_id: content.cmp_id,
    email: optionalContent.email,
    password: optionalContent.password,
    first_name: content.first_name,
    last_name: content.last_name,
    gender: optionalContent.gender,
    birth_date: content.date,
    name: optionalContent.name,
    industry: optionalContent.industry,
    founded_date: content.date,
    website: optionalContent.website,
    cmp_address: optionalContent.cmp_address,
    cmp_phone: content.cmp_phone
})