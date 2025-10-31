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

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Registro normal
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.register(dto, res);
  }

  // Login normal
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res);
  }

  // 🔹 SPA / Mobile login
  @ApiBody({ type: CreateGoogleDto })
  @ApiOperation({ summary: 'User login with Google (SPA / mobile)' })
  @Post('login/google')
  async loginWithGoogle(
    @Body() dto: CreateGoogleDto, 
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signInWithGoogle(dto, res);
  }

  // 🔹 Web OAuth redirection flow
  @ApiOperation({ summary: 'Redirect to Google OAuth login page' })
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Se redirige automáticamente a Google
  }

  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req) {
    return this.authService.validateGoogleUser(req.user);
  }

  // Logout
  @ApiOperation({ summary: 'Logout current user' })
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.signOut(res);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change current user password' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user, dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req: Request) {
    return this.authService.getProfile(req.user);
  }
}
