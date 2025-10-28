import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import config from './config/configuration';
import { configValidationSchema } from './config/configuration.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema: configValidationSchema,
      envFilePath: ['.env'],
    }),
    PrismaModule,
    AuthModule,
  ],
})
export class AppModule {}