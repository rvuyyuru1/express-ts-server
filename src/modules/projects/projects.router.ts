import { Authentication } from '@/middlewares/auth.middleware';
import JoiValidator from '@/middlewares/validator.middleware';
import AppRoutes from '@/utils/types/routes';
import { Router } from 'express';
import Joi from 'joi';
import { ProjecctController } from './projects.controller';

class ProjectRoutes implements AppRoutes {
  readonly path: string = '/api/projects';
  router: Router = Router();
  projectController = new ProjecctController();
  readonly JoiCreateProject = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
  });

  constructor() {
    this._initiliazeRoutes();
  }
  private _initiliazeRoutes() {
    this.router.post(
      '/',
      Authentication,
      JoiValidator.body(this.JoiCreateProject),
      this.projectController.CreateProjectHandler,
    );
    this.router.delete(
      '/:project_id',
      Authentication,
      this.projectController.DeleteProjectHandler,
    );
    this.router.get('/', Authentication, this.projectController.GetallProjects);
  }
}

export default ProjectRoutes;
