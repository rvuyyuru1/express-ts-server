import { NextFunction, Request, Response } from 'express';
import { ProjectService } from './projects.service';

export class ProjecctController {
  ProjectService = new ProjectService();
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public CreateProjectHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return this.ProjectService.CreateProject(req, res, next);
  };
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  public DeleteProjectHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return this.ProjectService.DeleteProject(req, res, next);
  };

  /**
   * GetallProjects
   */
  public GetallProjects = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return this.ProjectService.GetallProjects(req, res, next);
  };
}
