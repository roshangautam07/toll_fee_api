import { authRequest } from "../dto/request/requestBody.js"
import { authenticate } from "../services/auth.js"

export const auth = (req, res, next) => {
    const request = authRequest(req.body);
    authenticate(req.body).then(response => {
        console.log(response);
        res.json(response);
    }).catch((err) => {
        res.json(err)
    })
}