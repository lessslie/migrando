/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Controller,
    Get,
    Put,
    Body,
    UseGuards,
    Param,
    Query,
    Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { AuthUser } from 'src/modules/auth/decorators/auth-user.decorator';
import type { UserPayload } from 'src/modules/auth/interfaces/user-payload.interface';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    
    constructor(private readonly usersService: UsersService) {}

    // Perfil del usuario autenticado
    @Get('profile')
    @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
    getProfile(@AuthUser() user: UserPayload) {
        return this.usersService.findProfile(user.userId);
    }

    @Put('profile')
    @ApiOperation({ summary: 'Actualizar perfil del usuario autenticado' })
    updateProfile(
        @AuthUser() user: UserPayload,
        @Body() updateProfileDto: UpdateProfileDto,
    ) {
        return this.usersService.updateProfile(user.userId, updateProfileDto);
    }

    // Solo ADMIN: Gestión de usuarios
    @Get()
    // @UseGuards(RolesGuard)
    // @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'ADMIN: Listar todos los usuarios con paginación' })
    findAllUsers(@Query() query: PaginationDto) {
        return this.usersService.findAllUsers(query);
    }

    @Get(':id')
    // @UseGuards(RolesGuard)
    // @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'ADMIN: Obtener usuario por ID' })
    findUserById(@Param('id') id: string) {
        return this.usersService.findUserById(id);
    }

    @Put(':id')
    // @UseGuards(RolesGuard)
    // @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'ADMIN: Actualizar usuario por ID' })
    updateUser(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @AuthUser() admin: UserPayload,
    ) {
        return this.usersService.updateUser(id, updateUserDto, admin.userId);
    }

    @Delete(':id')
    // @UseGuards(RolesGuard)
    // @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'ADMIN: Eliminar usuario por ID' })
    deleteUser(
        @Param('id') id: string,
        @AuthUser() admin: UserPayload,
    ) {
        return this.usersService.deleteUser(id, admin.userId);
    }

    // Estadísticas
    @Get('stats')
    @ApiOperation({ summary: 'Obtener estadísticas del usuario autenticado' })
    getUserStats(@AuthUser() user: UserPayload) {
        return this.usersService.getUserStats(user.userId);
    }
}
