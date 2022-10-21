import { NextFunction, Request, Response } from 'express';
import { TaskService } from './tasks.service';

class TaskController {
  private _taskService = new TaskService();
  /**
   * AddNewTask
   */
  public AddNewTask = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    this._taskService.createNewTask(req, res, next);
  };
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public DeleteTask = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    this._taskService.Deletetask(req, res, next);
  };
}
export default TaskController;
