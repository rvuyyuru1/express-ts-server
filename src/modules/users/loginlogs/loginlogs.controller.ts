import { NextFunction, Request, Response } from 'express';
import LoginLogModel from './loginlogs.model';
import { verify } from 'jsonwebtoken';
import httpStatus from 'http-status';
import { SECRET_KEY } from '@/configs';
import { ResponseHandler } from '@/utils';

class LoginLogsController {
  private _loginLogsModel = LoginLogModel;
  public addloginlog = async (
    req: Request,
    token: string,
    next: NextFunction,
  ) => {
    try {
      let jwtPayLoad: any = await verify(token, SECRET_KEY);
      let expires_in = new Date(jwtPayLoad['exp'] * 1000);
      let { user_id } = jwtPayLoad;
      const newLog = new this._loginLogsModel({
        user_id,
        expires_in,
        ip_address: req['client_info'].ip,
        device_info: req['client_info'].device,
        browser_info: req['client_info'].browser,
        platform_info: req['client_info'].platform,
        token,
      });
      newLog.save();
    } catch (err) {
      next(err);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    let token = req['token'];

    try {
      let inactiveLog = await this._loginLogsModel.findOneAndUpdate(
        { token },
        { $set: { is_active: false, logout_date: Date.now() } },
      );
      if (inactiveLog) {
        ResponseHandler.SendResponse(
          res,
          httpStatus.OK,
          true,
          null,
          null,
          'Logged out',
          null,
        );
      } else {
        ResponseHandler.SendResponse(
          res,
          httpStatus.OK,
          false,
          null,
          null,
          'Logged out',
          null,
        );
      }
    } catch (err) {
      next(err);
    }
  };
  public Deletetoken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    let token = req['token'];
    try {
      let inactiveLog = await this._loginLogsModel.findOneAndDelete({ token });
      if (inactiveLog) {
        ResponseHandler.SendResponse(
          res,
          httpStatus.OK,
          true,
          null,
          null,
          'Logged out',
          null,
        );
      } else {
        ResponseHandler.SendResponse(
          res,
          httpStatus.OK,
          false,
          null,
          null,
          'Logged out',
          null,
        );
      }
    } catch (err) {
      next(err);
    }
  };

  public getLogList = async (req, res, next) => {
    let { user_id } = req['user'];
    try {
      let { page, size, populate, selectQuery, searchQuery, sortQuery } =
        ResponseHandler.ParseFilters(req, 10, false);
      searchQuery = { user_id, ...searchQuery };
      selectQuery =
        'login_date logout_date ip_address device_info browser_info is_active';
      const data = await ResponseHandler.GetQuerySendResponse(
        this._loginLogsModel,
        page,
        size,
        sortQuery,
        searchQuery,
        selectQuery,
        next,
        populate,
      );
      ResponseHandler.PaginationResponse(
        res,
        httpStatus.OK,
        true,
        data && data.data,
        'logs Get Success',
        page,
        size,
        data && data.totalData,
      );
    } catch (err) {
      next(err);
    }
  };
}

export default LoginLogsController;
