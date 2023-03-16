const Joi = require('joi');

const loginSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    })

const validateSignin = (req,res,next)=>{
    const {error} = loginSchema.validate(req.body);
    if(error){
        const err = new Error("invalid credentials from validator");
        err.statusCode= 400;
        return next(err);
    }
    next();
} 

module.exports = {
    validateSignin
};