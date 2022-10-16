import { ErrorFormater, ResponseHandler } from '@/utils';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
// These represent the incoming data containers that we might need to validate
const containers = {
  query: {
    storageProperty: 'originalQuery',
    joi: {
      convert: true,
      allowUnknown: false,
      abortEarly: false,
    },
  },
  // For use with body-parser
  body: {
    storageProperty: 'originalBody',
    joi: {
      convert: true,
      allowUnknown: false,
      abortEarly: false,
    },
  },
  headers: {
    storageProperty: 'originalHeaders',
    joi: {
      convert: true,
      allowUnknown: true,
      stripUnknown: false,
      abortEarly: false,
    },
  },
  // URL params e.g "/users/:userId"
  params: {
    storageProperty: 'originalParams',
    joi: {
      convert: true,
      allowUnknown: false,
      abortEarly: false,
    },
  },
  // For use with express-formidable or similar POST body parser for forms
  fields: {
    storageProperty: 'originalFields',
    joi: {
      convert: true,
      allowUnknown: false,
      abortEarly: false,
    },
  },
};
const CreateJoiValidator = (cfg: any) => {
  cfg = cfg || {}; // default to an empty config
  // We'll return this instance of the middleware
  const instance: {
    response?: any;
    query?: any;
    body?: any;
    headers?: any;
    fields?: any;
    params?: any;
  } = {
    response,
  };
  Object.keys(containers).forEach(type => {
    // e.g the "body" or "query" from above
    const container = containers[type];
    instance[type] = (schema: any, opts: any) => {
      opts = opts || {}; // like config, default to empty object
      const computedOpts = { ...container.joi, ...cfg.joi, ...opts.joi };
      return (req, res, next) => {
        const ret = schema.validate(req[type], computedOpts);
        if (!ret.error) {
          req[container.storageProperty] = req[type];
          req[type] = ret.value;
          next();
        } else if (opts.passError || cfg.passError) {
          ret.type = type;
          next(ret);
        } else {
          ResponseHandler.SendResponse(
            res,
            opts.statusCode || cfg.statusCode || httpStatus.BAD_REQUEST,
            false,
            null,
            ErrorFormater.buildErrorString(ret, `request ${type}`),
            'Validation Error!',
            null,
          );
        }
      };
    };
  });

  return instance;
  function response(schema, opts: any = {}) {
    const type = 'response';
    return (req: Request, res: Response, next: NextFunction) => {
      const resJson = res.json.bind(res);
      res.json = validateJson;
      next();
      function validateJson(json) {
        const ret = schema.validate(json, opts.joi);
        const { error, value } = ret;
        if (!error) {
          // return res.json ret to retain express compatibility
          return resJson(value);
        } else if (opts.passError || cfg.passError) {
          ret.type = type;
          next(ret);
        } else {
          ResponseHandler.SendResponse(
            res,
            opts.statusCode || cfg.statusCode || httpStatus.BAD_REQUEST,
            false,
            null,
            ErrorFormater.buildErrorString(ret, `request ${type}`),
            'Validation Error!',
            null,
          );
        }
      }
    };
  }
};

let JoiValidator = CreateJoiValidator({});
export default JoiValidator;
