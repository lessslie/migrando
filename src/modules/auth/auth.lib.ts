/* eslint-disable @typescript-eslint/require-await */
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class AuthLib {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    // ✅ Encripta la contraseña
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    // ✅ Compara contraseña ingresada con la almacenada
    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    // ✅ Genera un token JWT con datos básicos del usuario
    async generateToken(user: User): Promise<string> {
        const payload = { id: user.id, email: user.email, role: user.role };
        return this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '8h',
        });
    }

    // ✅ Genera un refresh token
    async generateRefreshToken(user: User): Promise<string> {
        const payload = { id: user.id, email: user.email };
        return this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
        });
    }

    // ✅ Agrega cookie segura
    async addCookie(res: any, token: string) {
        res.cookie('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000,
        });
    }

    // ✅ Valida usuario con Prisma
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
        if (!user) throw new ForbiddenException('User not found');
        return user;
    }
}
