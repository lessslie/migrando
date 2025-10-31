/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/auth/lib/auth.lib.ts
import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthLib {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    // 🔐 Encriptar / comparar contraseñas
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    // 🔹 Generar tokens
    async generateToken(user: { id: string; email: string; role: string }): Promise<string> {
        return this.jwtService.sign(
        { id: user.id, email: user.email, role: user.role },
        );
    }

    async generateRefreshToken(user: { id: string; email: string }): Promise<string> {
        return this.jwtService.sign(
        { id: user.id, email: user.email },
        { expiresIn: '7d' },
        );
    }

    // 🔸 Cookie segura
    addCookie(res: any, token: string) {
        res.cookie('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 8 * 60 * 60 * 1000,
        });
    }

    clearCookie(res: any) {
        res.clearCookie('auth-token', { path: '/' });
    }

    // 🔹 Buscar usuario
    async validateUser(email: string) {
        const user = await this.prisma.user.findUnique({
        where: { email },
        include: {
            comerciante: true,
            fabricante: true,
            logistica: true,
            proveedor: true,
        },
        });
        if (!user) throw new UnauthorizedException('User not found');
        return user;
    }

    async verifyToken(token: string) {
        return await this.jwtService.verify(token);
    }
    }
