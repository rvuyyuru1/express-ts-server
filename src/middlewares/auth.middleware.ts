import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { ResponseHandler } from '@/utils';
import { SECRET_KEY } from '@/configs';
import LoginLogModel from '@/modules/users/loginlogs/loginlogs.model';

/**
 *
 * @param req
 * @param _res
 * @param next
 * @returns
 */
const Authentication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token =
      req.body.token ||
      req.query.token ||
      req.headers['x-access-token'] ||
      req.headers.authorization ||
      req.headers.token ||
      req.cookies.token;
    if (token && token.length) {
      token = token.replace('Bearer ', '');
      const decodedToken = await jwt.verify(token, SECRET_KEY);
      if (decodedToken) {
        let loginlogs = LoginLogModel;
        let passed = await loginlogs.findOne({ token, is_active: true });
        if (passed) {
          req['user'] = decodedToken;
          return next();
        } else {
          return ResponseHandler.SendResponse(
            res,
            httpStatus.UNAUTHORIZED,
            false,
            null,
            null,
            'Session Expired',
            null,
          );
        }
      } else {
        return ResponseHandler.SendResponse(
          res,
          httpStatus.UNAUTHORIZED,
          false,
          null,
          token,
          'Session Expired / Token invalid!',
          null,
        );
      }
    } else
      return ResponseHandler.SendResponse(
        res,
        httpStatus.UNAUTHORIZED,
        false,
        null,
        null,
        'Token not found',
        null,
      );
  } catch (err) {
    return ResponseHandler.SendResponse(
      res,
      httpStatus.UNAUTHORIZED,
      false,
      null,
      err,
      'Session Expired / Token invalid!',
      null,
    );
  }
};
/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
const AuthenticationForLogout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token =
      req.body.token ||
      req.query.token ||
      req.headers['x-access-token'] ||
      req.headers.authorization ||
      req.headers.token;
    if (token && token.length) {
      token = token.replace('Bearer ', '');
      const d = await jwt.verify(token, SECRET_KEY);
      req['user'] = d;
      req['token'] = token;
      console.log(d, token);
      return next();
    } else
      return ResponseHandler.SendResponse(
        res,
        httpStatus.UNAUTHORIZED,
        false,
        null,
        token,
        'token not found',
        null,
      );
  } catch (err) {
    return ResponseHandler.SendResponse(
      res,
      httpStatus.UNAUTHORIZED,
      false,
      null,
      err,
      'Session Expired / Token invalid!',
      null,
    );
  }
};

export { Authentication, AuthenticationForLogout };
