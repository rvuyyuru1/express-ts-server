import { Authentication } from '@/middlewares/auth.middleware';
import { GlobalLimiter } from '@/middlewares/limiter.middleware';
import AppRoutes from '@/utils/types/routes';
import { Router } from 'express';
import TaskController from './tasks.controller';

class TaskRoutes implements AppRoutes {
  path: string = '/api/tasks';
  router: Router = Router();
  private _TaskController = new TaskController();
  constructor() {
    this._initilizeRoutes();
  }

  private _initilizeRoutes() {
    this.router.post(
      '/:project_id',
      GlobalLimiter(10),
      Authentication,
      this._TaskController.AddNewTask,
    );
    this.router.delete(
      '/:project_id/:task_id',
      GlobalLimiter(10),
      Authentication,
      this._TaskController.DeleteTask,
    );
  }
}

export default TaskRoutes;
