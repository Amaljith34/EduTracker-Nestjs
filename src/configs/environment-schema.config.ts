import * as Joi from 'joi';

export const EnvironmentSchemaConfig = Joi.object({
  PORT: Joi.string().default('4000'),
  STAGE: Joi.string().optional().default('Dev'),
  LOG_LEVEL: Joi.string().optional().default('development'),
  FRONTEND_URL: Joi.string().optional().default('http://localhost:3000'),
  MOBILE_URL: Joi.string().optional().default('http://localhost:8081'),
  DB_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().optional(),
  JWT_EXPIRES_IN: Joi.string().optional().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().optional().default('7d'),
});
