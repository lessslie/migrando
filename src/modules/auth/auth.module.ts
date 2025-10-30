// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthLib } from './auth.lib';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module'; // ✅ Importa este módulo

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'supersecret',
      signOptions: { expiresIn: '8h' },
    }),
    UsersModule, // ✅ Asegura la disponibilidad del repositorio
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthLib, PrismaService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
