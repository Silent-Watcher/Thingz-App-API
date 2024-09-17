import type { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export function handleExceptions(err: unknown, _req: Request, res: Response, next: NextFunction) {
  if (err) {
    // handle data validation error
    if (err instanceof z.ZodError) {
      res.status(httpStatus.BAD_REQUEST).json({
        status: res.statusCode,
        error: {
          code: 'bad request',
          message: fromZodError(err, { includePath: false }),
        },
      });
      return;
    }

    // handle system errors
    if (err instanceof Error) {
      const error = err as Error & { code?: string; status?: number };
      res.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).json({
        status: error.status,
        error: {
          code: error.code,
          message: error.message || 'Internal Server Error',
        },
      });
      return;
    }

    // handle unknown errors!
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: res.statusCode,
      error: {
        code: 'Error',
        message: 'Internal Server Error',
      },
    });
    return;
  } else next();
}

export function handleNotFoundErrors(req: Request, res: Response, _next: NextFunction) {
  return res.status(httpStatus.NOT_FOUND).send({
    status: res.statusCode,
    error: {
      code: 'not found',
      message: `route ${req.method}:${req.url} not found`,
    },
  });
}

export function errorHandler(app: Application) {
  app.use(handleExceptions);
  app.use(handleNotFoundErrors);
}
