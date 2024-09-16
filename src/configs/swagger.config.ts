import './app.swagger.json';
import type { Application } from 'express';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './app.swagger.json';

export function configSwagger(
  app: Application,
  swaggerDoc: swaggerUi.JsonObject = swaggerDocument,
): void {
  const theme = new SwaggerTheme();
  const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DRACULA),
  };
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, options));
}
