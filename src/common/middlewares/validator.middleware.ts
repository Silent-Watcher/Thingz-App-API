import type { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import type { ZodSchema } from 'zod';
import { fromError } from 'zod-validation-error';

function validate<T, U>(schema: ZodSchema<T>, data: U, res: Response) {
  const validationResult = schema.safeParse(data);
  if (!validationResult.success) {
    return res.status(httpStatus.NOT_ACCEPTABLE).send({
      status: res.statusCode,
      error: {
        code: 'NOT ACCEPTABLE',
        message: fromError(validationResult.error).toString(),
      },
    });
  }
}

// Middleware for validating request body
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    validate(schema, req.body as T, res); // Cast req.body to T
    next();
  };
}

// Middleware for validating request parameters
export function validateParams<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    validate(schema, req.params as T, res); // Cast req.params to T
    next();
  };
}

// Middleware for validating request query
export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    validate(schema, req.query as T, res); // Cast req.query to T
    next();
  };
}
