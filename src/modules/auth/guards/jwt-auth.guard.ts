/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    
    /**
     * Determina si la solicitud puede continuar.
     * Usa la lógica del guard de Passport para validar el JWT.
     */
    canActivate(context: ExecutionContext) {
        // Ejecuta la estrategia JWT configurada en JwtStrategy
        return super.canActivate(context);
    }

    /**
     * Maneja el resultado de la autenticación.
     * Si no hay usuario válido o ocurre un error, lanza excepción.
     */
    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
        throw err || new UnauthorizedException('Token inválido o expirado');
        }
        // ✅ Devuelve el usuario decodificado, que luego estará disponible como req.user
        return user;
    }
}
