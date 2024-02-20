const Joi = require('joi');
const message = require('./message');

let content = {
    name: Joi.string().min(4).max(50).required()
        .messages({
            'any.required': 'Name is required',
            'string.base': 'Name must be a string',
            'string.empty': 'Name cannot be empty',
            'string.min': 'Name should be minimum of 4 characters',
            'string.max': 'Name should be maximum of 50 characters',
        }),
    cmp_id: Joi.number().integer().min(1).required()
        .messages({
            'any.required': 'Company ID cannot be empty',
            'number.base': 'Company ID must be a number',
            'number.integer': 'Company ID must be an integer',
            'number.min': 'Company ID should be minimum of 1.',
        }),
    email: Joi.string().email().required()
        .messages({
            'any.required': 'Email cannot be empty',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Enter a valid email'
        }),
    password: Joi.string().min(4).required()
        .messages({
            'any.required': 'Password is required',
            'string.base': 'Password must be a string',
            'string.min': 'Password must have a minimum length of 4 characters'
        }),
    first_name: Joi.string().min(4).required()
        .messages({
            'any.required': 'Firstname cannot be empty',
            'string.base': 'Firstname must be a string',
            'string.empty': 'Firstname cannot be empty',
            'string.min': 'Name should be minimum of 4 characters',
        }),
    last_name: Joi.string().min(1).required()
        .messages({
            'any.required': 'Lastname cannot be empty',
            'string.base': 'Lastname must be a string',
            'string.empty': 'Lastname cannot be empty',
            'string.min': 'Name should be minimum of 1 characters',
        }),
    gender: Joi.string().valid('male', 'female', 'transgender', 'others').required()
        .messages({
            'any.required': 'Gender cannot be empty',
            'string.base': 'Gender must be a string',
            'string.empty': 'Gender cannot be empty',
            'any.only': 'Gender should be one the following: male, female, transgender and others'
        }),
    date: Joi.date()
        .messages({
            'any.only': 'Enter date in correct format'
        }),
    industry: Joi.string().required()
        .messages({
            'any.required': 'Industry is required',
            'string.empty': 'Industry cannot be empty'
        }),
    website: Joi.string().required()
        .messages({
            'any.required': 'Website is required',
            'string.empty': 'Website cannot be empty'
        }),
    cmp_address: Joi.string().required()
        .messages({
            'any.required': 'Company Address is required',
            'string.base': 'Company Address must be a string',
            'string.empty': 'Address cannot be empty'
        }),
    cmp_phone: Joi.string().length(12)
        .messages({
            'string.base': 'Phone Number must be a string',
            'string.empty': 'Phone Number cannot be empty',
            'any.only': 'Phone Number must have 10 digits'
        }),
    page: Joi.number().integer().min(1).required()
        .messages({
            'any.required': 'Page cannot be empty',
            'number.base': 'Page number must be a number',
            'number.integer': 'Page number must be an integer',
            'number.min': 'Page number should be minimum of 1 .',
        }),
    limit: Joi.number().integer().min(1).required()
        .messages({
            'any.required': 'Limit cannot be empty',
            'number.base': 'Limit must be a number',
            'number.integer': 'Limit must be an integer',
            'number.min': 'Limit should be minimum of 1.',
        }),
};

let optionalContent = {
    name: Joi.string().min(1).max(50)
        .messages({
            'string.base': 'Name must be a string',
            'string.empty': 'Name cannot be empty',
            'string.min': 'Name should be minimum of 1 characters',
            'string.max': 'Name should be maximum of 50 characters'
        }),
    cmp_id: Joi.number().integer()
        .messages({
            'number.base': 'Company ID must be a number',
            'number.integer': 'Company ID must be an integer',
            'number.base': 'Company ID must be a number',
        }),
    email: Joi.string().email()
        .messages({
            'string.empty': 'Email cannot be empty',
            'string.email': 'Enter a valid email'
        }),
    password: Joi.string().min(4)
        .messages({
            'string.base': 'Password must be a string',
            'string.min': 'Password must have a minimum length of 4 characters'
        }),
    first_name: Joi.string().min(4)
        .messages({
            'string.base': 'Firstname must be a string',
            'string.empty': 'Firstname cannot be empty',
            'string.min': 'Name should be minimum of 4 characters',
        }),
    last_name: Joi.string().min(1)
        .messages({
            'string.base': 'Lastname must be a string',
            'string.empty': 'Lastname cannot be empty',
            'string.min': 'Name should be minimum of 1 characters',
        }),
    gender: Joi.string().valid('male', 'female', 'transgender', 'others')
        .messages({
            'string.empty': 'Gender cannot be empty',
            'string.base': 'Gender must be a string',
            'any.only': 'Gender should be one the following: male, female, transgender and others'
        }),
    industry: Joi.string()
        .messages({
            'string.empty': 'Industry cannot be empty'
        }),
    website: Joi.string()
        .messages({
            'string.empty': 'Website cannot be empty'
        }),
    cmp_address: Joi.string()
        .messages({
            'string.empty': 'Address cannot be empty',
            'string.base': 'Company Address must be a string',
        }),
}

module.exports.userData = Joi.object({
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

module.exports.companyData = Joi.object({
    name: content.name,
    industry: content.industry,
    founded_date: content.date,
    website: content.website,
    email: content.email,
    cmp_address: content.cmp_address,
    cmp_phone: content.cmp_phone
})

module.exports.updateUserData = Joi.object({
    username: optionalContent.name,
    cmp_id: optionalContent.cmp_id,
    email: optionalContent.email,
    password: optionalContent.password,
    first_name: optionalContent.first_name,
    last_name: optionalContent.last_name,
    gender: optionalContent.gender,
    birth_date: content.date
})

module.exports.updateCompanyData = Joi.object({
    name: optionalContent.name,
    industry: optionalContent.industry,
    founded_date: content.date,
    website: optionalContent.website,
    cmp_address: optionalContent.cmp_address,
    cmp_phone: content.cmp_phone
})

module.exports.queryDataValues = Joi.object({
    page: content.page,
    limit: content.limit,
    cmp_id: optionalContent.cmp_id,
    date: content.date,
    cmp_name: optionalContent.name,
    username: optionalContent.name
});