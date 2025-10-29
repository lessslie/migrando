import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly prisma: PrismaService) {
        super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET ?? (() => {
            throw new Error('JWT_SECRET is not defined');
        })(),
        });
    }

    async validate(payload: any): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { id: payload.id } });
        if (!user) throw new UnauthorizedException('Invalid token');
        return user; // ✅ Esto se inyecta en req.user
    }
}
