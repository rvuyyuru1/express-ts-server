import BugsController from '@/modules/bugs/bugs.controller';
import AppRoutes from '@/utils/types/routes';
import { Router } from 'express';

class BugsRoutes implements AppRoutes {
  path: string = '/api/bugs';
  router: Router = Router();
  private bugsController = new BugsController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get('/', this.bugsController.GetErrors);
    this.router.get('/grby', this.bugsController.GetErrorsGroupBy);
    this.router.delete('/:id', this.bugsController.Deleteerror);
  }
}
export default BugsRoutes;
