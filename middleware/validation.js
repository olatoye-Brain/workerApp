const Joi = require('@hapi/joi')

//signup Validation
const signupValidation =  data => {
    const JoiSchema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().min(6).required().email().lowercase(),
        password: Joi.string().min(6).required()
    })

    return JoiSchema.validateAsync(data) 
}


//Login Validation
const loginValidation =  data => {
    const JoiSchema = Joi.object({
        email: Joi.string().min(6).required().email().lowercase(),
        password: Joi.string().min(6).required()
    })

    return JoiSchema.validateAsync(data) 
}

//Comment Validation
const commentValidation =  data => {
    const JoiSchema = Joi.object({
        commentPost: Joi.string().min(4).required()
    })

    return JoiSchema.validateAsync(data) 
}


//Worker Post Validation
const postValidation = data => {
    const JoiSchema = Joi.object({
        title: Joi.string().min(3).required(),
        description: Joi.string().min(3).required()
    })
    return JoiSchema.validateAsync(data) 
}



module.exports = {loginValidation, signupValidation, postValidation, commentValidation}


