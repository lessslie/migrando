// src/config/database.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;
  
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    logging: process.env.NODE_ENV === 'development',
  };
});