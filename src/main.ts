import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { 
  ValidationPipe, 
  HttpStatus,
  ClassSerializerInterceptor,
  Logger, // ✅ Logger nativo de NestJS
  HttpException
} from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { 
    cors: true
  });

  // ✅ Logger nativo de NestJS
  const logger = new Logger('Bootstrap');

  // Configuración
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('FabriConnect API')
    .setDescription('API para el sistema de gestión de cadena de suministro')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Ingrese el token JWT',
      in: 'header',
    })
    .addTag('products', 'Operaciones con productos')
    .addTag('auth', 'Autenticación y autorización')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Configuración de CORS
  app.enableCors({
    origin: corsOrigin.split(','),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Configuración global de pipes
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    transformOptions: {
      enableImplicitConversion: true,
    },
    exceptionFactory: (errors) => {
      const messages = errors.map((error) => ({
        field: error.property,
        errors: Object.values(error.constraints || {}),
      }));
      
      return new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Error de validación',
          errors: messages,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    },
  }),
);

  // Configuración global de interceptores
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new ResponseInterceptor(),
    new TimeoutInterceptor(),
  );

  // Filtro global de excepciones
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configuración del puerto
  await app.listen(port, '0.0.0.0');
  
  logger.log(`🚀 Aplicación ejecutándose en el puerto ${port}`);
  logger.log(`📚 Documentación de la API disponible en http://localhost:${port}/api`);
}

bootstrap().catch(err => {
  console.error('❌ Error al iniciar la aplicación:', err);
  process.exit(1);
});