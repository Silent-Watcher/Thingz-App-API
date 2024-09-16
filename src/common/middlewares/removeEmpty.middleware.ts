import type { NextFunction, Request, Response } from 'express';
import omitEmpty from 'omit-empty';

function removeEmpty(req: Request, _res: Response, next: NextFunction) {
  req.body = omitEmpty(req.body, { omitZero: true });
  next();
}

export default removeEmpty;
