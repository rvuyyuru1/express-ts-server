import AppRoutes from '@/utils/types/routes';
import BugsRoutes from './bugs/bugs.routes';
import UserRoutes from './users/users.routes';
import { Application } from 'express';
import ProjectRoutes from './projects/projects.router';
import TaskRoutes from './tasks/tasks.routes';
export class RoutingModule {
  private _Approutes: AppRoutes[] = [
    new UserRoutes(),
    new BugsRoutes(),
    new ProjectRoutes(),
    new TaskRoutes(),
  ];

  public initilizeRoutes(appcontainer: Application) {
    this._Approutes.forEach(({ path, router }: AppRoutes) => {
      appcontainer.use(path, router);
    });
  }
}
