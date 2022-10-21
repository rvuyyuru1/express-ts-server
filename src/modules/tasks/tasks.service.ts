import { ResponseHandler } from '@/utils';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import UserModel from '../users/users.model';

export class TaskService {
  private _useModel = UserModel;
  /**
   * createNewTask
   */
  public createNewTask = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user_id = req['user']['user_id'];
      const project_id = req.params['project_id'];
      const task = req.body;
      let result = await this._useModel.updateOne(
        {
          _id: user_id,
          'projects._id': project_id,
        },
        {
          $addToSet: {
            'projects.$.tasks': task,
          },
        },
      );
      console.log(result);

      if (result.modifiedCount)
        ResponseHandler.SendResponse(
          res,
          httpStatus.OK,
          true,
          null,
          null,
          `Created New Task for  project "${project_id}" added to user "${user_id}"!`,
          null,
        );
      else
        ResponseHandler.SendResponse(
          res,
          httpStatus.BAD_REQUEST,
          true,
          null,
          null,
          'No User / No Project Found - Something went wrong!',
          null,
        );
    } catch (error) {
      next(error);
    }
  };

  public Deletetask = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user_id = req['user']['user_id'];
      const project_id = req.params['project_id'];
      const task_id = req.params['task_id'];
      console.log(user_id, project_id, task_id);
    } catch (error) {
      next(error);
    }
  };
}
