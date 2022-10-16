import AppRoutes from '@/utils/types/routes';
import BugsRoutes from './bugs/bugs.routes';
import UserRoutes from './users/users.routes';
import { Application } from 'express';
export class RoutingModule {
  private _Approutes: AppRoutes[] = [new UserRoutes(), new BugsRoutes()];
  public initilizeRoutes(appcontainer: Application) {
    this._Approutes.forEach(({ path, router }: AppRoutes) => {
      appcontainer.use(path, router);
    });
  }
}
