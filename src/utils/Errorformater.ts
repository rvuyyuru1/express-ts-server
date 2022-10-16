import { NextFunction, Response } from 'express';
/**
 *
 * @param err
 * @returns
 */
const FormatErrorObj = (err: any): any => {
  const formatError = err.toString();
  const obj = JSON.parse(
    JSON.stringify(formatError.substring(formatError.indexOf('{'))),
  );
  return JSON.parse(obj);
};
/**
 *
 * @param err
 * @param next
 * @returns
 */
const OutputJSONErrorMessage = (err: any, next: NextFunction): any => {
  try {
    const obj = FormatErrorObj(err);
    return {
      status_code: obj.status_code,
      message: obj.message,
    };
  } catch (err) {
    return next(err);
  }
};
/**
 *
 * @param err
 * @param next
 * @returns
 */
const GetErrorObj = (err: any, next: NextFunction) => {
  try {
    const errorObj = {
      error_message: '',
      error_stack: '',
      error_type: '',
      path: '',
      method: '',
    };
    if (typeof err === 'string') {
      errorObj.error_message = err;
      errorObj.error_stack = err;
      errorObj.error_type = '';
    } else {
      errorObj.error_message = err.message;
      errorObj.error_stack = err.stack;
      errorObj.error_type = err.name;
      errorObj.path = err.path;
      errorObj.method = err.method;
    }
    return errorObj;
  } catch (err) {
    return next(err);
  }
};
/**
 *
 * @param err
 * @returns
 */
const sendFormattedErrorData = (err: any) => {
  return err.length > 0 ? err[0].msg : '';
};
/**
 *
 * @param res
 * @param cancellationErr
 * @param next
 * @returns
 */
function CustomErrorResponse(
  res: Response,
  cancellationErr: any,
  next: NextFunction,
) {
  try {
    const errorMessage = OutputJSONErrorMessage(cancellationErr, next);
    res.status(errorMessage.status_code);
    res.json({
      status: errorMessage.status_code,
      message: errorMessage.message,
    });
  } catch (err) {
    return next(err);
  }
}

function buildErrorString(error, container) {
  let ret = `Error validating ${container}.`;
  let details = error.error.details;
  for (let i = 0; i < details.length; i++) {
    ret += ` ${details[i].message}.`;
  }
  return ret;
}
export const ErrorFormater = {
  sendFormattedErrorData,
  CustomErrorResponse,
  FormatErrorObj,
  GetErrorObj,
  OutputJSONErrorMessage,
  buildErrorString,
};
