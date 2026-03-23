import express from 'express';
import { appUpdate, downloadAPK, generateToken, remoteBillPrint, remoteLogOut, remoteRestart, uploadApk } from '../controllers/updateController.js';
import { getUser } from '../controllers/user.js';
import authorization from '../middleware/authorization.js';
import { methodNotAllowed } from '../middleware/methodNotAllowed.js';
import { getDynamicFormTemplate } from '../controllers/dynamicFormTemplate.js';
import { DynamicFormController } from '../controllers/dynamicFormController.js';
var router = express.Router();

export default function usersRouter(express){
  const router = express.Router();

  // router
  //   .route('/get_user')
  //   .get(authorization(),getUser)
  //   .all(methodNotAllowed);
  router
  .route('/update/:id')
    .get(appUpdate);
  router
    .route('/download/:id')
    .get(downloadAPK);
  router
    .route('/upload')
    .post(uploadApk);
  router
    .route('/remoteLogout')
    .get(remoteLogOut);
  router
    .route('/remoteBillPrint/:deviceId')
    .post(remoteBillPrint);
    router
    .route('/remoteRestart/:deviceId')
      .get(remoteRestart);
  router
    .route('/generate')
    .get(generateToken);

  router
    .route('/dynamic-form-template')
    .get(getDynamicFormTemplate);

    router
      .route('/dynamic-form-template/from-user-input')
      .get(DynamicFormController.getAllParameters)

      router
      .route('/form-template')
      .post(DynamicFormController.setupTemplate);
  return router;
}
