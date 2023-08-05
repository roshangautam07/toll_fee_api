import express from 'express';
import { appUpdate, downloadAPK, uploadApk } from '../controllers/updateController.js';
import { getUser } from '../controllers/user.js';
import authorization from '../middleware/authorization.js';
import { methodNotAllowed } from '../middleware/methodNotAllowed.js';
var router = express.Router();

export default function usersRouter(express){
  const router = express.Router();

  router
    .route('/get_user')
    .get(authorization(),getUser)
    .all(methodNotAllowed);
  router
  .route('/update/:id')
    .get(authorization(),appUpdate);
  router
    .route('/download/:id')
    .get(downloadAPK);
  router
    .route('/upload')
    .post(uploadApk);
  return router;
}
