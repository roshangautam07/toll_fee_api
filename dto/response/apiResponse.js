import dotenv from 'dotenv';
dotenv.config()
const PORTS = process.env.PORT || 8080;

export function jsonResponse(res, code, message, data = [], error = []) {
  return res
    .status(code)
    .json({ message: message, data: data, error: res.err });
}


export function responseJsonWithhData(res, statusCode,status, message, data = [], error = []) {
    return res.status(statusCode).json({
    status,
    message: message,
    data: data,
  });
}

export function apiResponse(res,statusCode, status, message = "null", data) {
  return res.status(statusCode).json({status, message, data });
}