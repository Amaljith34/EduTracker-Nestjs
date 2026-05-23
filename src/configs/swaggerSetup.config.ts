import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

const pkg = require('../../package.json');

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Intern Tracker API')
  .setDescription(
    `Intern tracker APIs running in ${process.env.STAGE?.toUpperCase() ?? 'DEV'} at PORT ${process.env.PORT ?? 4000}.`,
  )
  .setVersion(`v${pkg.version}`)
  .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    'Token',
  )
  .build();

export const swaggerCustomOption: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customSiteTitle: 'Intern Tracker API Docs',
};
