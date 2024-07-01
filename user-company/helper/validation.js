const Joi = require("joi");

let content = {
    name: Joi.string().min(4).max(50).required().messages({
        "any.required": "Name is required",
        "string.base": "Name must be a string",
        "string.empty": "Name cannot be empty",
        "string.min": "Name should be minimum of 4 characters",
        "string.max": "Name should be maximum of 50 characters",
    }),
    cmp_id: Joi.number().integer().min(1).required().messages({
        "any.required": "Company ID cannot be empty",
        "number.base": "Company ID must be a number",
        "number.integer": "Company ID must be an integer",
        "number.min": "Company ID should be minimum of 1.",
    }),
    user_id: Joi.number().integer().min(1).required().messages({
        "any.required": "User ID cannot be empty",
        "number.base": "User ID must be a number",
        "number.integer": "User ID must be an integer",
        "number.min": "User ID should be minimum of 1.",
    }),
    email: Joi.string().email().required().messages({
        "any.required": "Email cannot be empty",
        "string.empty": "Email cannot be empty",
        "string.email": "Enter a valid email",
    }),
    password: Joi.string().min(4).required().messages({
        "any.required": "Password is required",
        "string.base": "Password must be a string",
        "string.min": "Password must have a minimum length of 4 characters",
    }),
    first_name: Joi.string().min(4).required().messages({
        "any.required": "Firstname cannot be empty",
        "string.base": "Firstname must be a string",
        "string.empty": "Firstname cannot be empty",
        "string.min": "Name should be minimum of 4 characters",
    }),
    last_name: Joi.string().min(1).required().messages({
        "any.required": "Lastname cannot be empty",
        "string.base": "Lastname must be a string",
        "string.empty": "Lastname cannot be empty",
        "string.min": "Name should be minimum of 1 characters",
    }),
    gender: Joi.string()
        .valid("male", "female", "transgender", "others")
        .required()
        .messages({
            "any.required": "Gender cannot be empty",
            "string.base": "Gender must be a string",
            "string.empty": "Gender cannot be empty",
            "any.only":
                "Gender should be one the following: male, female, transgender and others",
        }),
    date: Joi.date().messages({
        "any.only": "Enter date in correct format",
    }),
    birth_date: Joi.date().required().messages({
        "any.only": "Enter birth date in correct format",
    }),
    founded_date: Joi.date().required().messages({
        "any.only": "Enter founded date in correct format",
    }),
    assoc_st_dt: Joi.date().required().messages({
        "any.required": "assoc_st_dt is required",
    }),
    assoc_en_dt: Joi.date().required().messages({
        "any.required": "assoc_en_dt is required",
    }),
    industry: Joi.string().required().messages({
        "any.required": "Industry is required",
        "string.empty": "Industry cannot be empty",
    }),
    website: Joi.string().required().messages({
        "any.required": "Website is required",
        "string.empty": "Website cannot be empty",
    }),
    cmp_address: Joi.string().required().messages({
        "any.required": "Company Address is required",
        "string.base": "Company Address must be a string",
        "string.empty": "Address cannot be empty",
    }),
    phone: Joi.string().length(13).messages({
        "string.base": "Phone Number must be a string",
        "string.empty": "Phone Number cannot be empty",
        "any.only": "Phone Number must have 10 digits",
    }),
    page: Joi.number().integer().min(1).required().messages({
        "any.required": "Page number is required",
        "number.base": "Page number must be a number",
        "number.integer": "Page number must be an integer",
        "number.min": "Page number should be minimum of 1 .",
    }),
    limit: Joi.number().integer().min(1).required().messages({
        "any.required": "Limit is required",
        "number.base": "Limit must be a number",
        "number.integer": "Limit must be an integer",
        "number.min": "Limit should be minimum of 1.",
    }),
    assoc_target_mthly: Joi.number().integer().allow(null).messages({
        "number.base": "Monthly Target must be a number",
        "number.integer": "Monthly Target must be an integer",
    }),
    assoc_target_mthly_usd: Joi.number().integer().allow(null).messages({
        "number.base": "Monthly Target USD must be a number",
        "number.integer": "Monthly Target USD must be an integer",
    }),
    is_team_lead: Joi.number().integer().valid(0, 1).messages({
        "number.base": "is_team_lead must be a number 0 or 1",
        "number.integer": "is_team_lead must be a number 0 or 1",
        "any.only": "is_team_lead must be a number 0 or 1",
    }),
    currency: Joi.string().required().valid("INR", "USD").messages({
        "any.required": "Currency is required",
        "string.base": "Currency must be a string",
        "string.empty": "Currency cannot be empty",
        "any.only": "The only valid currencies are INR and USD",
    }),
    image_url: Joi.string().required().messages({
        "any.required": "Image base-64 data is required",
        "string.empty": "Image base-64 data cannot be empty",
    }),
    message: Joi.string().required().messages({
        "any.required": "Message is required",
        "string.base": "Message must be a string",
        "string.empty": "Message cannot be empty",
    }),
};

let optionalContent = {
    name: Joi.string().min(1).max(50).messages({
        "string.base": "Name must be a string",
        "string.empty": "Name cannot be empty",
        "string.min": "Name should be minimum of 1 characters",
        "string.max": "Name should be maximum of 50 characters",
    }),
    cmp_id: Joi.number().integer().messages({
        "number.base": "Company ID must be a number",
        "number.integer": "Company ID must be an integer",
        "number.base": "Company ID must be a number",
    }),
    user_id: Joi.number().integer().min(1).messages({
        "number.base": "User ID must be a number",
        "number.integer": "User ID must be an integer",
        "number.min": "User ID should be minimum of 1.",
    }),
    email: Joi.string().email().messages({
        "string.empty": "Email cannot be empty",
        "string.email": "Enter a valid email",
    }),
    password: Joi.string().min(4).messages({
        "string.base": "Password must be a string",
        "string.min": "Password must have a minimum length of 4 characters",
    }),
    first_name: Joi.string().min(4).messages({
        "string.base": "Firstname must be a string",
        "string.empty": "Firstname cannot be empty",
        "string.min": "Name should be minimum of 4 characters",
    }),
    last_name: Joi.string().min(1).messages({
        "string.base": "Lastname must be a string",
        "string.empty": "Lastname cannot be empty",
        "string.min": "Name should be minimum of 1 characters",
    }),
    birth_date: Joi.date().messages({
        "any.only": "Enter birth date in correct format",
    }),
    founded_date: Joi.date().messages({
        "any.only": "Enter founded date in correct format",
    }),
    gender: Joi.string()
        .valid("male", "female", "transgender", "others")
        .messages({
            "string.empty": "Gender cannot be empty",
            "string.base": "Gender must be a string",
            "any.only":
                "Gender should be one the following: male, female, transgender and others",
        }),
    industry: Joi.string().messages({
        "string.empty": "Industry cannot be empty",
    }),
    website: Joi.string().messages({
        "string.empty": "Website cannot be empty",
    }),
    cmp_address: Joi.string().messages({
        "string.empty": "Address cannot be empty",
        "string.base": "Company Address must be a string",
    }),
    assoc_st_dt: Joi.date().messages({
        "any.only": "assoc_st_dt  in correct format",
    }),
    assoc_en_dt: Joi.date().messages({
        "any.only": "assoc_en_dt  in correct format",
    }),
    currency: Joi.string().valid("INR", "USD").messages({
        "string.base": "Currency must be a string",
        "string.empty": "Currency cannot be empty",
        "any.only": "The only valid currencies are INR and USD",
    }),
};

module.exports.userData = Joi.object({
    username: content.name,
    cmp_id: content.cmp_id,
    email: content.email,
    password: content.password,
    first_name: content.first_name,
    last_name: content.last_name,
    gender: content.gender,
    birth_date: content.birth_date,
    user_phone: content.phone,
    image_url: content.image_url,
});
// return joischema.validate(user);
module.exports.updateUserData = Joi.object({
    username: optionalContent.name,
    cmp_id: optionalContent.cmp_id,
    user_phone: content.phone,
    // email: optionalContent.email,
    password: optionalContent.password,
    first_name: optionalContent.first_name,
    last_name: optionalContent.last_name,
    gender: optionalContent.gender,
    birth_date: optionalContent.birth_date,
});
module.exports.queryUserData = Joi.object({
    user_id: optionalContent.name,
    page: content.page,
    limit: content.limit,
    // user_id: content.user_id,
    cmp_id: content.cmp_id,
    date: content.date,
    cmp_name: optionalContent.name,
    username: optionalContent.name,
});

module.exports.companyData = Joi.object({
    name: content.name,
    industry: content.industry,
    founded_date: content.founded_date,
    website: content.website,
    email: content.email,
    cmp_address: content.cmp_address,
    cmp_phone: content.phone,
});
module.exports.updateCompanyData = Joi.object({
    name: optionalContent.name,
    industry: optionalContent.industry,
    founded_date: optionalContent.founded_date,
    website: optionalContent.website,
    cmp_address: optionalContent.cmp_address,
    cmp_phone: content.phone,
});
module.exports.queryCompanyData = Joi.object({
    page: content.page,
    limit: content.limit,
    cmp_id: optionalContent.cmp_id,
    date: content.date,
    cmp_name: optionalContent.name,
});

module.exports.targetData = Joi.object({
    user_id: content.user_id,
    assoc_team_name: content.name,
    assoc_target_mthly: content.assoc_target_mthly,
    cmp_id: content.cmp_id,
    assoc_st_dt: content.assoc_st_dt,
    assoc_en_dt: content.assoc_en_dt,
    assoc_target_mthly_usd: content.assoc_target_mthly_usd,
    is_team_lead: content.is_team_lead,
    currency: content.currency,
});
module.exports.queryTargetData = Joi.object({
    page: content.page,
    limit: content.limit,
    user_id: optionalContent.user_id,
    cmp_id: optionalContent.cmp_id,
    date: content.date,
});
module.exports.updateTargetData = Joi.object({
    // user_id: content.user_id,
    assoc_team_name: optionalContent.name,
    assoc_target_mthly: content.assoc_target_mthly,
    cmp_id: optionalContent.cmp_id,
    assoc_st_dt: optionalContent.assoc_st_dt,
    assoc_en_dt: optionalContent.assoc_en_dt,
    assoc_target_mthly_usd: content.assoc_target_mthly_usd,
    is_team_lead: content.is_team_lead,
    currency: optionalContent.currency,
});

module.exports.validNotification = Joi.object({
    page: content.page,
    limit: content.limit,
    cmp_id: content.cmp_id,
    user_id: optionalContent.name,
    message: content.message,
});
