// src/config/configuration.schema.ts
import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // Configuración del servidor
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
  REQUEST_TIMEOUT: Joi.number().default(30000),
  API_PREFIX: Joi.string().default('api'),

  // Base de datos
  DATABASE_URL: Joi.string().required(),

  // Autenticación JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  // Logging
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'log', 'debug', 'verbose')
    .default('log'),
});