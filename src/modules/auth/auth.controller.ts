import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/signIn.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { GoogleAuthGuard } from './guards/google.guard';
import { CreateGoogleDto } from './dto/create-google.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 🟢 Registro tradicional
  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.register(dto, res);
  }

  // 🟢 Login tradicional (email y contraseña)
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión con credenciales' })
  @ApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res);
  }

  // 🟢 Login con Google (para SPA o móvil)
  @Post('login/google')
  @ApiOperation({ summary: 'Iniciar sesión con Google (SPA / móvil)' })
  @ApiBody({ type: CreateGoogleDto })
  async loginWithGoogle(@Body() dto: CreateGoogleDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signInWithGoogle(dto, res);
  }

  // 🟡 Redirección OAuth (para web)
  @Get('google')
  @ApiOperation({ summary: 'Redirigir al inicio de sesión con Google (OAuth)' })
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Redirige automáticamente al login de Google
  }

  // 🟡 Callback de Google OAuth
  @Get('google/callback')
  @ApiOperation({ summary: 'Procesar el callback de Google (OAuth)' })
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req) {
    return this.authService.validateGoogleUser(req.user);
  }

  // 🔴 Cerrar sesión
  @Post('logout')
  @ApiOperation({ summary: 'Cerrar sesión del usuario actual' })
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.signOut(res);
  }

  // 🔁 Refrescar token
  @Post('refresh')
  @ApiOperation({ summary: 'Refrescar el token de acceso' })
  @ApiBody({ type: RefreshTokenDto })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  // 🔒 Cambiar contraseña
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar la contraseña del usuario actual' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user, dto);
  }

  // 👤 Obtener perfil
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' })
  async getProfile(@Req() req: Request) {
    return this.authService.getProfile(req.user);
  }
}
