import { SECRET_KEY, EXPIRES_IN, COOKIE_EXPIRE } from '@/configs';
import { ResponseHandler } from '@/utils';
import { genSalt, hash, compare } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { sign } from 'jsonwebtoken';
import LoginLogsController from './loginlogs/loginlogs.controller';
import UserModel from './users.model';
class UserService {
  private _userModel = UserModel;
  LoginLogs = new LoginLogsController();
  public ValidateAndCreateUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    let { body } = req;
    let { email } = body;
    let present = await this._userModel.find({ email });
    if (!!present.length) {
      ResponseHandler.SendResponse(
        res,
        httpStatus.CONFLICT,
        false,
        null,
        null,
        'User already exit!',
        null,
      );
    } else {
      let salt = await genSalt(10);
      let hashpassword = await hash(body.password, salt);
      let user = new this._userModel({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        imgUrl: body.imgUrl,
        password: hashpassword,
      });
      let result = await user.save();

      let token = sign(
        {
          user_id: result._id,
        },
        `${SECRET_KEY}`,
        {
          expiresIn: EXPIRES_IN,
        },
      );
      if (token && result) {
        this.LoginLogs.addloginlog(req, token, next);
        var date = new Date();
        // Default at 365 days.
        // Get unix milliseconds at current time plus number of days
        date.setTime(+date + (Number(COOKIE_EXPIRE) || 365 * 86400000)); //24 * 60 * 60 * 1000
        res.cookie('token', token, {
          secure: false,
          httpOnly: true,
          expires: new Date(date),
        });
        ResponseHandler.SendResponse(
          res,
          httpStatus.OK,
          true,
          null,
          null,
          'User data created successfully!',
          token,
        );
      } else {
        ResponseHandler.SendResponse(
          res,
          httpStatus.BAD_REQUEST,
          false,
          null,
          null,
          'Invalid Data',
          null,
        );
      }
    }
  };

  public ValidateAndCreateSession = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    let { body } = req;
    let { email, password } = body;
    let user = await this._userModel.findOne({ email });
    if (user) {
      let isValid = await compare(password, user.password);
      if (isValid) {
        let token = sign(
          {
            user_id: user._id,
          },
          `${SECRET_KEY}`,
          {
            expiresIn: EXPIRES_IN,
          },
        );
        this.LoginLogs.addloginlog(req, token, next);
        var date = new Date();
        // Default at 365 days.
        // Get unix milliseconds at current time plus number of days
        date.setTime(+date + (Number(COOKIE_EXPIRE) || 365 * 86400000)); //24 * 60 * 60 * 1000
        res.cookie('token', token, {
          secure: false,
          httpOnly: true,
          expires: date,
        });
        ResponseHandler.SendResponse(
          res,
          httpStatus.OK,
          true,
          null,
          null,
          'User Session created successfully!',
          token,
        );
      } else {
        ResponseHandler.SendResponse(
          res,
          httpStatus.BAD_REQUEST,
          false,
          null,
          null,
          'Password Invaild!',
          null,
        );
      }
    } else {
      ResponseHandler.SendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        null,
        'No user Found!',
        null,
      );
    }
  };
  /**
   * GetUser
   */
  public GetUser = async (req: Request, res: Response) => {
    let user = req['user'];
    if (user) {
      let userdetails = await this._userModel
        .findById({ _id: user.user_id })
        .select('-password');
      if (userdetails)
        ResponseHandler.SendResponse(
          res,
          httpStatus.OK,
          true,
          userdetails,
          null,
          'user details',
          null,
        );
      else
        ResponseHandler.SendResponse(
          res,
          httpStatus.BAD_REQUEST,
          true,
          null,
          null,
          'no user!',
          null,
        );
    } else {
      ResponseHandler.SendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        null,
        'Something went wrong!',
        null,
      );
    }
    // }
  };

  /**
   * Update User
   *
   */
  public UpdateUser = async (req: Request, res: Response) => {
    let { user_id } = req.params;
    let { body } = req;
    let result = await this._userModel.findByIdAndUpdate(
      { _id: user_id },
      {
        $set: {
          ...body,
        },
      },
    );
    if (result)
      ResponseHandler.SendResponse(
        res,
        httpStatus.OK,
        true,
        null,
        null,
        'updated',
        null,
      );
    else
      ResponseHandler.SendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        null,
        'User not found / some thing went wrong!',
        null,
      );
  };
  /**
   * Delete User
   *
   */
  public DeleteUser = async (req: Request, res: Response) => {
    let user = req['user'];
    let userdetails = await this._userModel.findByIdAndRemove({
      _id: user.user_id,
    });
    if (userdetails)
      ResponseHandler.SendResponse(
        res,
        httpStatus.OK,
        true,
        null,
        null,
        'user deleted',
        null,
      );
    else
      ResponseHandler.SendResponse(
        res,
        httpStatus.BAD_REQUEST,
        true,
        null,
        null,
        'no user!',
        null,
      );
  };
  /**
   * Update User
   *
   */
  public LogoutUserSession = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    this.LoginLogs.logout(req, res, next);
  };
}

export default UserService;
