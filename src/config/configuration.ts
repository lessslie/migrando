import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    // Configuración del servidor
    nodeEnv: process.env.NODE_ENV || 'development',
     port: parseInt(process.env.PORT || '3000', 10),
    corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    apiPrefix: process.env.API_PREFIX || 'api',
    
    // Base de datos
    database: {
      url: process.env.DATABASE_URL,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    },
    
    // Autenticación
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    
    // Tiempos de espera
    timeouts: {
    request: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10),
    },
    
    // Logging
    logging: {
      level: process.env.LOG_LEVEL || (isProduction ? 'log' : 'debug'),
      maxFiles: isProduction ? 14 : 3, // Rotación de logs
    },
  };
});