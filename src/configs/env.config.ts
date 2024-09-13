import { fromZodError } from 'zod-validation-error';
import logger from './logger.config';
import { z } from 'zod';

const environmentSchema = z.object({
	PORT: z.string(),

	NODE_ENV: z.enum(['development', 'production']),
	APP_ENV: z.enum(['development', 'production']),

	MONGO_USERNAME: z.string(),
	MONGO_PASSWORD: z.string(),
	MONGO_HOST: z.string(),
	MONGO_PORT: z.string(),
	DB_NAME: z.string(),

	JWT_SECRET: z.string(),
	COOKIE_SECRET: z.string(),
});

const envParsedResult = environmentSchema.safeParse(process.env);

if (!envParsedResult.success) {
	logger.error(fromZodError(envParsedResult.error).message);
	throw new Error('there is an error with env variables!');
}

type EnvVarSchemaType = z.infer<typeof environmentSchema>;

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		interface ProcessEnv extends EnvVarSchemaType {}
	}
}
