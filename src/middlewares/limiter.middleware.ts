import ExpressBrute from 'express-brute';
import MongooseStore from 'express-brute-mongoose';
import mongoose from 'mongoose';
import moment from 'moment';
import httpStatus from 'http-status';
import { ResponseHandler } from '@/utils';
import { NODE_ENV } from '@/configs';
const BruteForceSchema = require('express-brute-mongoose/dist/schema');
const model = mongoose.model(
  'bruteforce',
  new mongoose.Schema(BruteForceSchema),
);
var store;
if (NODE_ENV === 'development') {
  store = new ExpressBrute.MemoryStore();
} else {
  store = new MongooseStore(model);
}
var failCallback = function (_req, res, _next, nextValidRequestDate) {
  ResponseHandler.SendResponse(
    res,
    httpStatus.TOO_MANY_REQUESTS,
    false,
    null,
    null,
    "You've made too many failed attempts in a short period of time, please try again " +
      moment(nextValidRequestDate).fromNow(),
    null,
  );
};
var handleStoreError = function (error) {
  throw {
    message: error.message,
    parent: error.parent,
  };
};

// Start slowing requests after 5 failed attempts to do something for the same user per day per IP
export const userBruteforce = new ExpressBrute(store, {
  freeRetries: 5,
  attachResetToRequest: false,
  refreshTimeoutOnRequest: false,
  minWait: 25 * 60 * 60 * 1000, // 5 minutes
  maxWait: 25 * 60 * 60 * 1000, // 1 hour,
  lifetime: 24 * 60 * 60 * 1000,
  failCallback: failCallback,
  handleStoreError: handleStoreError,
});
