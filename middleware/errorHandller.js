/* eslint-disable no-undef */
import dotenv from 'dotenv';
dotenv.config()
import {apiResponse, jsonResponse} from '../dto/response/apiResponse.js';
import { UNPROCESSABLE_ENTITY } from '../helpers/constants/responseStatusCode.js';
export default errorHandler;

function errorHandler(err, req, res, next) {
  switch (true) {
    case typeof err === 'string':
      // custom application error
      const is404 = err.toLowerCase().endsWith('not found');
      const statusCode = is404 ? 404 : 400;
      return jsonResponse(res, statusCode, err);
    case err.name === 'UnauthorizedError':
      // jwt authentication error
      return apiResponse(res, 401,'Error','Token is Invalid',null);
    case err.status === 404:
      return jsonResponse(res, err.status, err.message);
    case err.status === 401:
      return jsonResponse(res, err.status, err.message);
    case err.status === 405:
      return jsonResponse(res, err.status, err.message);
    case err.status === 400:
      return jsonResponse(res, err.status, err.message);
    case err.status === 422:
      return jsonResponse(res, err.status, err.message);
    case err.status === 403:
      return jsonResponse(res, err.status, err.message);
    case err.status === 204:
      return jsonResponse(res, err.status, err.message);
    case err.status === 501:
      return jsonResponse(res, err.status, err.message);
    case err.name === 'SequelizeValidationError':
      //return jsonResponse(res, 422, err.errors.map(e => e.message))

      const { errors } = err;

      //array of object
      const errorList = errors.map((e) => {
        const objs = {};
        objs[e.path] = e.message;
        // objs= e.message;
        return objs;
      });

      //single validation object
      const object = {};

      const errorObject = errorList.map((obj) => {
        const prop = Object.getOwnPropertyNames(obj);
        object[prop] = obj[prop];
        return object;
      });
      //   console.log(errorObject);

      // return jsonResponse(res, 422, errorList);
      return jsonResponse(
        res,
        UNPROCESSABLE_ENTITY,
        errorObject.filter((x) => typeof x !== 'undefined').shift()
      );
    case err.name === 'Error':
      return process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'test'
        ? jsonResponse(res, 500, err.message)
        : jsonResponse(res, 500, 'Somethings went wrong');
    case err.name === 'TypeError':
      return process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'test'
        ? jsonResponse(res, 500, err.message)
        : jsonResponse(res, 500, 'Somethings went wrong');
    default:
      jsonResponse(res, 500, err.message);
  }
}
