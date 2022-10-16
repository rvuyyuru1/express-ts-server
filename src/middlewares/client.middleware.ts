import { NextFunction, Request, Response } from 'express';
import useragent from 'useragent';
import requestIp from 'request-ip';
/**
 *
 * @param req
 * @param _res
 * @param next
 * @returns
 */
const GetClientInfo = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    let info: any = {};
    let platform = req.headers['platform'];
    let agent = useragent.parse(req.headers['user-agent']);
    info.browser = agent.toAgent().toString();
    info.os = agent.os.toString();
    info.device = agent.device.toString();
    info.ip = requestIp.getClientIp(req);
    if (platform) {
      if (platform == 'android' || platform == 'ios') {
      } else {
        platform = 'web';
      }
    } else {
      platform = 'web';
    }
    info['platform'] = platform;
    // on localhost you'll see 127.0.0.1 if you're using IPv4
    // or ::1, ::ffff:127.0.0.1 if you're using IPv6
    req['client_info'] = info;
    return next();
  } catch (error) {
    next(error);
  }
};

export { GetClientInfo };
