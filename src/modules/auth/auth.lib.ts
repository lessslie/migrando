/* eslint-disable @typescript-eslint/require-await */
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

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

    // ✅ Compara contraseñas
    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    // ✅ Genera access token (solo usa id, email, role)
    async generateToken(user: { id: string; email: string; role: string }): Promise<string> {
        const payload = { id: user.id, email: user.email, role: user.role };
        return this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '8h',
        });
    }

    // ✅ Genera refresh token (solo id + email)
    async generateRefreshToken(user: { id: string; email: string }): Promise<string> {
        const payload = { id: user.id, email: user.email };
        return this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
        });
    }

    // ✅ Cookie segura
    async addCookie(res: any, token: string) {
        res.cookie('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000,
        });
    }

    // ✅ Buscar usuario por email
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

    // ✅ Verifica token
    async verifyToken(token: string): Promise<any> {
        return this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    }
}