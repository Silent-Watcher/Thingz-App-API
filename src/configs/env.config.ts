import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import logger from './logger.config';

const environmentSchema = z.object({
  PORT: z.string(),

  NODE_ENV: z.enum(['development', 'production']),
  APP_ENV: z.enum(['development', 'production']),

  PROTOCOL: z.enum(['http', 'https']),
  HOST_NAME: z.string(),
  SERVER_ADDR: z.string(),

  MONGO_USERNAME: z.string(),
  MONGO_PASSWORD: z.string(),
  MONGO_HOST: z.string(),
  MONGO_PORT: z.string(),
  DB_NAME: z.string(),

  JWT_SECRET: z.string(),
  COOKIE_SECRET: z.string(),

  SMS_API_TOKEN: z.string()
});

const envParsedResult = environmentSchema.safeParse(process.env);

if (!envParsedResult.success) {
  logger.error(fromZodError(envParsedResult.error).message);
  throw new Error('there is an error with env variables!');
}

type EnvVarSchemaType = z.infer<typeof environmentSchema>;

declare global {
  // biome-ignore lint/style/noNamespace: <explanation>
  namespace NodeJS {
    interface ProcessEnv extends EnvVarSchemaType {}
  }
}
