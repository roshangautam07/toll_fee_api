import express from 'express';
import { auth } from '../controllers/auth.js';
import { methodNotAllowed } from '../middleware/methodNotAllowed.js';
import { authValidationSchema } from '../validation/auth.js';
var router = express.Router();

export default function authRouter(express){
  const router = express.Router();

  router
    .route('/login')
    .post(authValidationSchema, auth)
    .all(methodNotAllowed);
  return router;
}
