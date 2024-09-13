import '$app/configs/env.config';

import logger, { startLogger } from './configs/logger.config';
import { configSwagger } from '$app/configs/swagger.config';
import connectToMongoDb from '$app/configs/db.config';
import cookieParser from 'cookie-parser';
import { errorHandler } from '$app/common/exceptions';
import express from 'express';

import router from './common/router';

const app = express();
const PORT = Number(process.env.PORT || 8080);
const { DB_NAME } = process.env;

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json(), express.urlencoded({ extended: true }));

// logger
startLogger(app);
// swagger
configSwagger(app);
// router
app.use(router);
// error handler
errorHandler(app);

connectToMongoDb(DB_NAME as string)
	.then(() => {
		logger.info('connected to mongoDB successfully');
		app.listen(PORT, '0.0.0.0', () => {
			logger.info(`Server listening at http://localhost:${PORT}`);
		});
	})
	.catch(() => {
		logger.error('failed to connect to mongodb');
	});
