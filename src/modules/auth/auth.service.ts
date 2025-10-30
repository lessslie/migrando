/* eslint-disable @typescript-eslint/require-await */
// src/auth/auth.service.ts
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthLib } from './auth.lib';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/signIn.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private authLib: AuthLib) {}

  async register(dto: RegisterDto, res: Response) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new BadRequestException('User already exists');

    const hash = await this.authLib.hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: dto.role,
      },
    });

    const accessToken = await this.authLib.generateToken(user);
    const refreshToken = await this.authLib.generateRefreshToken(user);
    await this.authLib.addCookie(res, accessToken);

    return { message: 'User registered successfully', user, accessToken, refreshToken };
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.authLib.validateUser(dto.email);
    const valid = await this.authLib.comparePassword(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const accessToken = await this.authLib.generateToken(user);
    const refreshToken = await this.authLib.generateRefreshToken(user);
    await this.authLib.addCookie(res, accessToken);

    return { message: 'Login successful', user, accessToken, refreshToken };
  }

  async refresh(dto: RefreshTokenDto) {
    try {
     const payload = await this.authLib.verifyToken(dto.refreshToken);

      // 🔥 obtenemos el id del payload, no el email del dto
      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) throw new UnauthorizedException('Invalid token');

      const accessToken = await this.authLib.generateToken(user);
      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(res: Response) {
    res.clearCookie('auth-token');
    return { message: 'Logged out successfully' };
  }

  async changePassword(user: any, dto: ChangePasswordDto) {
    const found = await this.prisma.user.findUnique({
      where: { id: user.id },
    });
    if (!found) throw new UnauthorizedException('User not found');

    const valid = await this.authLib.comparePassword(
      dto.currentPassword,
      found.password,
    );
    if (!valid) throw new UnauthorizedException('Incorrect current password');

    const newHash = await this.authLib.hashPassword(dto.newPassword);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: newHash },
    });

    return { message: 'Password updated successfully' };
  }


  async getProfile(user: any) {
    return this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        comerciante: true,
        fabricante: true,
        logistica: true,
        proveedor: true,
      },
    });
  }
}
