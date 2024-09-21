import '$app/configs/env.config';

import { errorHandler } from '$app/common/exceptions';
import connectToMongoDb from '$configs/db.config';
import cookieParser from 'cookie-parser';
import express from 'express';
import logger, { startLogger } from '$configs/logger.config';

import router from './common/router';
import { configSwaggerV1 } from '$api/v1/swagger.config';
import configs from './configs';

const app = express();
const PORT = Number(process.env.PORT || 8080);
const { DB_NAME } = process.env;

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json(), express.urlencoded({ extended: true }));

// static files
app.use('/static', express.static(configs.STATIC_FILES_PATH));

// logger
startLogger(app);
// run swagger for api v1
configSwaggerV1(app);
// router
app.use(router);
// error handler
errorHandler(app);

connectToMongoDb(DB_NAME as string)
  .then(() => {
    logger.info('connected to mongoDB successfully');
    app
      .listen(PORT, '0.0.0.0', () => {
        logger.info(`Server listening at ${process.env.SERVER_ADDR}`);
      })
      .on('error', (err) => {
        logger.error(err.message);
      });
  })
  .catch(() => {
    logger.error('failed to connect to mongodb');
  });
