import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import config from './config/configuration';
import { configValidationSchema } from './config/configuration.schema';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config, databaseConfig],  // Agregamos databaseConfig aquí
      validationSchema: configValidationSchema,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    AuthModule,
  ],
})
export class AppModule {}