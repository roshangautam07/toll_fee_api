import Joi from "joi";
import genericRequestValidation from "../middleware/genericRequestValidation.js";

export const authValidationSchema = (req,res,next) => {
    
    const schema = Joi.object({
        email: Joi.string()
            .required()
            .messages({ 'any.required': 'email is required' }),
        password: Joi.string()
            .required()
            .messages({ 'any.required': 'password is required' }),
    });
    genericRequestValidation(req, res, next, schema);
}