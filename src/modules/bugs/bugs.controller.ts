import { HttpException } from '@/exceptions/httpExecption';
import BugsModel from '@/modules/bugs/bugs.model';
import { ErrorFormater, ResponseHandler } from '@/utils';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

class BugsController {
  public bugs = BugsModel;
  /**
   * AddErrorToLogs
   */
  public AddErrorToLogs = async (
    req: Request,
    _res: Response,
    next: NextFunction,
    err: HttpException,
  ) => {
    const is_already = await this.bugs.findOne({ error_message: err.message });
    if (is_already) {
      return await this.bugs.findOneAndUpdate(
        { error_message: err.message },
        {
          $set: {
            count: is_already.count + 1,
            added_by: req['user'] && req['user'].id,
          },
        },
        { new: true },
      );
    }
    const errObj = ErrorFormater.GetErrorObj(err, next);
    errObj['added_by'] = req['user'] && req['user'].id;
    errObj['device'] = req['device'];
    errObj['ip'] = req['client_ip_address'];
    const bug = await new this.bugs(errObj);
    return bug.save();
  };

  /**
   * GetErrors
   */
  public GetErrors = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      let { page, size, populate, selectQuery, searchQuery, sortQuery } =
        ResponseHandler.ParseFilters(req, 10, false);
      if (req?.query?.find_errors) {
        searchQuery = {
          error_stack: { $regex: req?.query?.find_errors, $options: 'i' },
          ...searchQuery,
        };
      }
      let bugs: any = await ResponseHandler.GetQuerySendResponse(
        this.bugs,
        page,
        size,
        sortQuery,
        searchQuery,
        selectQuery,
        populate,
        next,
      );
      ResponseHandler.PaginationResponse(
        res,
        httpStatus.OK,
        true,
        bugs.data,
        'Here are the bugs folks!!',
        page,
        size,
        bugs.totalData,
        sortQuery,
      );
    } catch (error) {
      next(error);
    }
  };

  public GetErrorsGroupBy = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const bugs = await this.bugs.aggregate([
        { $group: { _id: '$error_type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);
      let totalData = 0;
      bugs.forEach(each => {
        totalData = totalData + each.count;
      });

      ResponseHandler.PaginationResponse(
        res,
        httpStatus.OK,
        true,
        bugs,
        'bugs by group',
        1,
        1,
        totalData,
      );
    } catch (err) {
      next(err);
    }
  };
  /**
   * Deleteerror
   */
  public Deleteerror = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id;
      const del = await this.bugs.findByIdAndUpdate(id, {
        $set: { is_deleted: true },
      });
      ResponseHandler.SendResponse(
        res,
        httpStatus.OK,
        true,
        del,
        null,
        'bug delete success!',
        null,
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * DeleteAll
   */
  public DeleteAll = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const del = await this.bugs.remove({});
      if (del)
        ResponseHandler.SendResponse(
          res,
          httpStatus.OK,
          true,
          null,
          null,
          'all errors deleted!!',
          null,
        );
    } catch (err) {
      next(err);
    }
  };

  public SelectMultipleData = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { bug_id } = req.body;
      const Data = await this.bugs.updateMany(
        { _id: { $in: bug_id } },
        {
          $set: {
            is_deleted: true,
            deleted_at: new Date(),
          },
        },
      );
      ResponseHandler.SendResponse(
        res,
        httpStatus.OK,
        true,
        Data,
        null,
        'Multiple Data Delete Success',
        null,
      );
    } catch (error) {
      next(error);
    }
  };
}
export default BugsController;
