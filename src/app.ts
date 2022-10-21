import mongoose, { set, connect } from 'mongoose';
import { DatabaseOptions } from './database';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import morgan from 'morgan';
import device from 'express-device';
import httpStatus from 'http-status';
import {
  NODE_ENV,
  PORT,
  DB_DATABASE,
  LOG_FORMAT,
  ORIGIN,
  CREDENTIALS,
} from './configs';
import { ResponseHandler } from './utils';
import BugsController from './modules/bugs/bugs.controller';
import { RoutingModule } from './modules/app.routing.module';
import { HttpException } from './exceptions/httpExecption';
class AppContainer {
  private _app: express.Application;
  private _port: string | number;
  public _env = NODE_ENV || 'development';
  private _routing = new RoutingModule();
  constructor() {
    this._app = express();
    this._port = PORT || 3000;
    this._initializeDatebase();
    this._initializeMiddleware();
    this._initializeRouting();
    this._initializeErrors();
  }
  //   initialDatebase
  /**
   * @initialDatebase
   *
   */
  private _initializeDatebase() {
    if (this._env !== 'production') {
      set('debug', true);
    }

    connect(DatabaseOptions.url, DatabaseOptions.options, () => {
      console.log(`======= DataBase: ${DB_DATABASE} =======`);
      console.log(`🚀 Database connected`);
      console.log(`at ⌚ ${new Date()}`);
      console.log(`=================================`);
    });
    mongoose.connection.on('error', function (err) {
      console.log('Mongoose default connection has occured ' + err + ' error');
      console.log(`killing server at ⌚  ${new Date()} `);
      process.exit(0);
    });

    mongoose.connection.on('disconnected', function () {
      console.log('Mongoose default connection is disconnected');
      console.log(`killing server at ⌚  ${new Date()} `);
      process.exit(0);
    });

    process.on('SIGINT', function () {
      mongoose.connection.close(function () {
        console.log(
          'Mongoose default connection is disconnected due to application termination',
        );
        console.log(`killing server at ⌚  ${new Date()} `);
        process.exit(0);
      });
    });
    process.on('ECONNREFUSED', function () {
      mongoose.connection.close(function () {
        console.log(
          'Mongoose default connection is disconnected due to application termination',
        );
        console.log(`killing server at ⌚  ${new Date()} `);
        process.exit(0);
      });
    });
  }

  //   initialMiddleware
  /**
   * @initialMiddleware
   *
   */
  private _initializeMiddleware() {
    this._app.use(compression());
    this._app.use(device?.capture());
    this._app.use(morgan(LOG_FORMAT));
    this._app.use(
      express.json({
        limit: '50mb',
      }),
    );
    this._app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    this._app.use(hpp());
    this._app.use(helmet());
    this._app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this._app.disable('x-powered-by');
    this._app.use((_req, res, next) => {
      res.setHeader('X-XSS-Protection', '1; mode=block');
      next();
    });
    // this._app.use(monitor());
  }

  //   _initialRouting
  /**
   * @initialRouting
   *
   */
  private _initializeRouting() {
    this._routing.initilizeRoutes(this._app);
  }

  //   initializeErrors
  /**
   * @initializeErrors
   *
   */
  private _initializeErrors() {
    // catch 404 and forward to error handler
    this._app.use((_req: Request, _res: Response, next: NextFunction) => {
      const err = new HttpException(404, 'Resource not found!');
      next(err);
    });
    // error handler
    // no stacktraces leaked to user unless in development environment
    this._app.use(
      (
        err: HttpException,
        req: Request,
        res: Response,
        _next: NextFunction,
      ) => {
        let path = req?.path;
        err.method = req.method;
        err.path = path;
        console.log('\x1b[41m', err);
        if (err.status === 404) {
          return ResponseHandler.SendResponse(
            res,
            httpStatus.NOT_FOUND,
            false,
            null,
            err,
            'Route Not Found',
            null,
          );
        } else {
          let bug = new BugsController();
          bug.AddErrorToLogs(req, res, _next, err);
          return ResponseHandler.SendResponse(
            res,
            httpStatus.INTERNAL_SERVER_ERROR,
            false,
            null,
            err,
            null,
            null,
          );
        }
      },
    );
  }

  public listen = () => {
    this._app.listen(this._port, () => {
      console.log(`=================================`);
      console.log(`======= ENV: ${this._env} =======`);
      console.log(`🚀 App started listening on the port ${this._port}`);
      console.log(`at ⌚  ${new Date()} `);
      console.log(`=================================`);
    });
  };
}
export default AppContainer;
