import { Authentication } from '@/middlewares/auth.middleware';
import BugsController from '@/modules/bugs/bugs.controller';
import AppRoutes from '@/utils/types/routes';
import { Router } from 'express';

class BugsRoutes implements AppRoutes {
  readonly path: string = '/api/bugs';
  router: Router = Router();
  private bugsController = new BugsController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get('/', Authentication, this.bugsController.GetErrors);
    this.router.get(
      '/grby',
      Authentication,
      this.bugsController.GetErrorsGroupBy,
    );
    this.router.delete('/:id', Authentication, this.bugsController.Deleteerror);
  }
}
export default BugsRoutes;
