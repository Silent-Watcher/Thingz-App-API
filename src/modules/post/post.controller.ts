import type { NextFunction, Request, Response } from 'express';
import Controller from '../../interfaces/controller.interface';

class PostContoller extends Controller {
  constructor() {
    super();
  }
  index(_req: Request, res: Response, _next: NextFunction) {
    res.send('postindexhere');
  }
}

export default new PostContoller();
