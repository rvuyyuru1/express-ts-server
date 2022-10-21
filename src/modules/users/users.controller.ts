import { NextFunction, Request, Response } from 'express';
import UserService from './users.services';

class UserController {
  _userservice = new UserService();
  /**
   * @AddUser
   * @param req
   * @param res
   * @param next
   */
  public AddUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return this._userservice.ValidateAndCreateUser(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  /**
   * @CreateSession
   * @param req
   * @param res
   * @param next
   */
  public CreateSession = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      return this._userservice.ValidateAndCreateSession(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update User
   * @UpdateUser
   */
  public UpdateUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      this._userservice.UpdateUser(req, res);
    } catch (error) {
      next(error);
    }
  };
  /**
   *
   * @GetUser
   */
  public GetUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this._userservice.GetUser(req, res);
    } catch (error) {
      next(error);
    }
  };
  /**
   *
   * @GetUser
   */
  public DeleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      this._userservice.DeleteUser(req, res);
    } catch (error) {
      next(error);
    }
  };
  /**
   *
   * @LogoutUser
   */
  public LogOutUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      this._userservice.LogoutUserSession(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
export default UserController;
