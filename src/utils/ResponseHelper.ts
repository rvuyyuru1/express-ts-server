import { NextFunction, Request, Response } from 'express';

/**
 *
 * @param req
 * @param defaults
 * @param is_deleted
 * @returns {any}
 */
const ParseFilters = (
  req: Request,
  defaults: number,
  is_deleted: boolean,
): any => {
  const size_default: number = defaults ? defaults : 10;
  let page: number;
  let size: number;
  let sortQuery: any = { _id: -1 };
  let searchQuery: any = {};
  let populate = [];
  let selectQuery: any = { __v: 0 };
  if (is_deleted) {
    searchQuery = { ...searchQuery, is_deleted: is_deleted };
    selectQuery = {
      ...selectQuery,
      is_deleted: 0,
      deleted_at: 0,
      deleted_by: 0,
    };
  }
  if (!!req?.query?.page) {
    page = Math.abs(Number(req.query.page));
  } else {
    page = 1;
  }
  if (req?.query?.size) {
    size = Math.abs(Number(req.query.size));
  } else {
    size = size_default;
  }
  if (req?.query?.sort) {
    let sort: any = req?.query.sort;
    let sortField = sort?.slice(1);
    let sortBy = sort?.slice(0, 0);
    if (sortBy == 1) {
      //one is ascending
      sortQuery = sortField;
    } else if (sortBy == 0) {
      //zero is descending
      sortQuery = '-' + sortField;
    } else {
      sortQuery = '';
    }
  }
  return { page, size, sortQuery, searchQuery, selectQuery, populate };
};

/**
 *
 * @param {Response} res
 * @param  {number} status
 * @param {boolean} issuccess
 * @param {unknown} data
 * @param { unknown} errors
 * @param {string} msg
 * @param {string} token
 * @returns {Response}
 */
const SendResponse = (
  res: Response,
  status: number,
  issuccess: boolean,
  data: unknown,
  errors: unknown,
  msg: string,
  token: string,
): Response => {
  const response: any = {};
  response.success = issuccess;
  if (!!data) response.data = data;
  if (!!errors) response.errors = errors;
  if (!!msg) response.msg = msg;
  if (!!token) response.token = token;
  return res.status(status).json(response);
};

/**
 *
 * @param res
 * @param status
 * @param is_success
 * @param data
 * @param msg
 * @param pageNo
 * @param pagesize
 * @param totalData
 * @param selectQuery
 * @returns {Response}
 */
const PaginationResponse = (
  res: Response,
  status: number,
  is_success: boolean,
  data: unknown,
  msg: string,
  pageNo: number,
  pagesize: number,
  totalData: number,
  selectQuery?: any,
): Response => {
  const response: any = {};
  if (data) response.data = data;
  response.success = is_success;
  if (msg) response.msg = msg;
  if (pageNo) response.page = pageNo;
  if (pagesize) response.size = pagesize;
  if (totalData) response.totalData = totalData;
  if (selectQuery) response.selectQuery = selectQuery;
  return res.status(status).json(response);
};

/**
 *
 * @param model
 * @param page
 * @param size
 * @param sortQuery
 * @param searchQuery
 * @param selectQuery
 * @param populate
 * @param next
 * @returns {Prommise}
 */
const GetQuerySendResponse = async (
  model: any,
  page: number,
  size: number,
  sortQuery: any,
  searchQuery: any,
  selectQuery: any,
  populate: any,
  next: NextFunction,
): Promise<any> => {
  let pulledData: any = {};
  try {
    pulledData.data = await model
      .find(searchQuery)
      .select(selectQuery)
      .sort(sortQuery)
      .skip((page - 1) * size)
      .limit(size)
      .populate(populate);
    pulledData.totalData = await model.countDocuments(searchQuery);
    return pulledData;
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @returns {string}
 */
// const GenrateUUID4 = (): string => {
//   return uuid();
// };

/**
 *
 * @param {number} len
 * @returns {string}
 */
const GenerateRandomNumberString = (len: number): string => {
  return Math.floor(Math.random() * 8999 + 1000)
    .toString()
    .substring(0, len);
};
/**
 *
 * @param text
 * @returns {string}
 */
const Slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

/**
 *
 * @param {string} text
 * @returns {string}
 */
const Regexp = (text: string): string => {
  return text.replace(/[-[\]{}()*+?.,\\/^$|#]/g, ''); // Remove all non-word chars
};

export const ResponseHandler = {
  SendResponse,
  PaginationResponse,
  ParseFilters,
  GetQuerySendResponse,
  Slugify,
  Regexp,
  GenerateRandomNumberString,
};
