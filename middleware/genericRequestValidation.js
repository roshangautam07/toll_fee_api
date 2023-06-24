import { jsonResponse } from "../dto/response/apiResponse.js";


export default genericRequestValidation;

function genericRequestValidation(req, res, next, schema) {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true,
        errors: {
            wrap: {
              label: ''
            }
          } // remove unknown props
    };
    const { error, value } = schema.validate(req.body, options);


    if (error) {

        const errors = error.details;
        const errorList = errors.map(e => {
            let obj = {};
            obj[e.path] = e.message;
            return obj;
        });

        let object = {};

        const errorObject = errorList.map(((obj)=> {
          const prop = Object.getOwnPropertyNames(obj);
          object[prop] = obj[prop];
          return object;
        }));

        // response.jsonResponse(res, 422, errorList);
        jsonResponse(
            res,422,errorObject.filter(x => typeof x!=='undefined').shift()
            );
    } else {
        req.body = value;
        next();
    }
}
