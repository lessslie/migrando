/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        // Ejecuta la estrategia JWT configurada
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        if (err || !user) {
        throw err || new UnauthorizedException('Token inválido o expirado');
        }
        return user;
    }
}
