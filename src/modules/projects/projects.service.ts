import { ResponseHandler } from '@/utils';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import UserModel from '../users/users.model';

export class ProjectService {
  private _useModel = UserModel;
  /**
   * @CreateProject
   */
  public CreateProject = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      let user = req['user'];
      let project = req.body;
      let result = await this._useModel.findByIdAndUpdate(
        {
          _id: user?.user_id,
        },
        {
          $addToSet: {
            projects: project,
          },
        },
      );
      if (result.isModified)
        ResponseHandler.SendResponse(
          res,
          httpStatus.OK,
          true,
          null,
          null,
          `new Project added for user ${user.user_id}`,
          null,
        );
      else
        ResponseHandler.SendResponse(
          res,
          httpStatus.BAD_REQUEST,
          true,
          null,
          null,
          'No User Found / Something went wrong!',
          null,
        );
    } catch (error) {
      next(error);
    }
  };
  /**
   * DeleteProject = async
   */
  public DeleteProject = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      let user = req['user'];
      let project_id = req?.params['project_id'];
      let result = await this._useModel.updateOne(
        {
          _id: user?.user_id,
        },
        {
          $pull: {
            projects: { _id: project_id },
          },
        },
      );

      if (result.modifiedCount)
        ResponseHandler.SendResponse(
          res,
          httpStatus.OK,
          true,
          null,
          null,
          `Project "${project_id}" deleted for user "${user.user_id}"!`,
          null,
        );
      else
        ResponseHandler.SendResponse(
          res,
          httpStatus.BAD_REQUEST,
          true,
          null,
          null,
          'No Found / Something went wrong!',
          null,
        );
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  /**
   * GetallProjects =
   */
  public GetallProjects = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      let user = req['user'];
      let result = await this._useModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(user.user_id),
          },
        },
        { $unwind: { path: '$projects' } },
        {
          $facet: {
            data: [
              {
                $group: {
                  _id: '$_id',
                  count: { $sum: 1 },
                  project: { $push: '$projects' },
                },
              },
            ],
          },
        },
      ]);
      if (result)
        ResponseHandler.SendResponse(
          res,
          httpStatus.OK,
          true,
          !!result[0].data[0]
            ? result[0].data[0]
            : {
                count: 0,
                project: [],
              },
          null,
          `new Project added for user ${user.user_id}`,
          null,
        );

      // searchQuery = {
      //   _id: user.user_id,
      // };
      // if (req?.query?.name) {
      //   searchQuery = {
      //     'projects.name': { $regex: req?.query?.name, $options: 'i' },
      //     ...searchQuery,
      //   };
      // }
      // console.log(page, size, populate, selectQuery, searchQuery, sortQuery);
      // let bugs: any = await ResponseHandler.GetQuerySendResponse(
      //   this._useModel,
      //   page,
      //   size,
      //   sortQuery,
      //   searchQuery,
      //   selectQuery,
      //   populate,
      //   next,
      // );

      // ResponseHandler.PaginationResponse(
      //   res,
      //   httpStatus.OK,
      //   true,
      //   bugs.data,
      //   'Here are the bugs folks!!',
      //   page,
      //   size,
      //   bugs.totalData,
      //   sortQuery,
      // );
      // let project_id = req?.params['project_id'];
      // next();
    } catch (error) {
      next(error);
    }
  };
}
