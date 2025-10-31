import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLib } from './auth.lib';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '8h' },
    }),
    UsersModule,
  ],
  providers: [AuthService, AuthLib, PrismaService, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
