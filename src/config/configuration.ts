import { registerAs } from '@nestjs/config';
import { AppConfig } from './configuration.interface';

export default registerAs('app', (): AppConfig => ({
  port: parseInt(process.env.PORT || '3000', 10),
  isProduction: process.env.NODE_ENV === 'production',
  jwt: {
    secret: process.env.JWT_SECRET || 'clave_secreta_por_defecto',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/fabripasantes_db',
  },
}));