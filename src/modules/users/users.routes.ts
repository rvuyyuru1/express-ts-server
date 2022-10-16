import {
  Authentication,
  AuthenticationForLogout,
} from '@/middlewares/auth.middleware';
import { GetClientInfo } from '@/middlewares/client.middleware';
import { userBruteforce } from '@/middlewares/limiter.middleware';
import JoiValidator from '@/middlewares/validator.middleware';
import AppRoutes from '@/utils/types/routes';

import { Router } from 'express';
import Joi from 'joi';
import LoginLogsController from './loginlogs/loginlogs.controller';
import UserController from './users.controller';

class UserRoutes implements AppRoutes {
  path: string = '/api/users';
  router: Router = Router();
  _userController = new UserController();
  _loginLogsController = new LoginLogsController();
  JoiCreateObject = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    imgUrl: Joi.string(),
  });
  JoiCreateSessionObject = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  JoiUpdateUserObject = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    imgUrl: Joi.string(),
  });
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(
      '/getuserdetails',
      Authentication,
      this._userController.GetUser,
    );
    this.router.post(
      '/',
      GetClientInfo,
      JoiValidator.body(this.JoiCreateObject),
      this._userController.AddUser,
    );
    this.router.post(
      '/login',
      userBruteforce.prevent,
      GetClientInfo,
      this._userController.CreateSession,
    );
    this.router.put(
      '/:user_id',
      Authentication,
      this._userController.UpdateUser,
    );

    this.router.delete(
      '/:user_id',
      Authentication,
      this._userController.DeleteUser,
    );
    this.router.get(
      '/logout',
      AuthenticationForLogout,
      this._userController.LogOutUser,
    );
  }
}
export default UserRoutes;
