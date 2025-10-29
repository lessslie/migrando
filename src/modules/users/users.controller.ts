/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Controller,
    Get,
    Put,
    Body,
    UseGuards,
    Request,
    Param,
    Query,
    Delete,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';

// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; 
// import { RolesGuard } from 'src/auth/guards/roles.guard';
// import { Roles } from 'src/auth/decorators/roles.decorator';
// import { UserRole } from '@prisma/client';
// import { AuthUser } from 'src/auth/decorators/auth-user.decorator'; // Decorador para inyectar req.user
// import { UserPayload } from 'src/auth/interfaces/user-payload.interface'; // Interfaz de tu JWT

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // // =========================================================================
    // // RUTAS DE PERFIL DEL USUARIO (sin :id, usan el token)

    // @Get('profile')
    // @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
    // getProfile(@AuthUser() user: UserPayload) {
    //     return this.usersService.findProfile(user.userId);
    // }

    // @Put('profile')
    // @ApiOperation({ summary: 'Actualizar perfil del usuario autenticado' })
    // updateProfile(@AuthUser() user: UserPayload, @Body() updateProfileDto: UpdateProfileDto) {
    //     return this.usersService.updateProfile(user.userId, updateProfileDto);
    // }
    
    // // =========================================================================
    // // RUTAS DE NOTIFICACIONES

    // @Get('notifications')
    // @ApiOperation({ summary: 'Obtener lista de notificaciones con paginación' })
    // getNotifications(
    //     @AuthUser() user: UserPayload,
    //     @Query() { page, limit }: PaginationDto,
    // ) {
    //     // Nota: El ValidationPipe de NestJS validará y transformará 'page' y 'limit'
    //     return this.usersService.getNotifications(user.userId, page, limit);
    // }

    // @Put('notifications/mark-all-read')
    // @ApiOperation({ summary: 'Marcar todas las notificaciones como leídas' })
    // markAllRead(@AuthUser() user: UserPayload) {
    //     return this.usersService.markAllNotificationsAsRead(user.userId);
    // }

    // @Put('notifications/:id/read')
    // @ApiOperation({ summary: 'Marcar una notificación específica como leída' })
    // markNotificationAsRead(
    //     @AuthUser() user: UserPayload,
    //     @Param('id', ParseUUIDPipe) notificationId: string,
    // ) {
    //     return this.usersService.markNotificationAsRead(user.userId, notificationId);
    // }
    
    // // =========================================================================
    // // RUTAS DE ESTADÍSTICAS

    // @Get('stats')
    // @ApiOperation({ summary: 'Obtener estadísticas del usuario por su rol' })
    // getUserStats(@AuthUser() user: UserPayload) {
    //     return this.usersService.getUserStats(user.userId);
    // }

    // // =========================================================================
    // // RUTAS DE ADMINISTRACIÓN (requieren ROLE: ADMIN)
    
    // // Nota: Se debe usar @UseGuards(RolesGuard) y @Roles(UserRole.ADMIN) aquí.

    // @Get()
    // @UseGuards(RolesGuard)
    // @Roles(UserRole.ADMIN)
    // @ApiOperation({ summary: 'ADMIN: Obtener lista de todos los usuarios con filtros y paginación' })
    // findAllUsers(@Query() query: PaginationDto) {
    //     return this.usersService.findAllUsers(query);
    // }

    // @Get(':id')
    // @UseGuards(RolesGuard)
    // @Roles(UserRole.ADMIN)
    // @ApiOperation({ summary: 'ADMIN: Obtener usuario por ID' })
    // findUserById(@Param('id', ParseUUIDPipe) id: string) {
    //     return this.usersService.findUserById(id);
    // }

    // @Put(':id')
    // @UseGuards(RolesGuard)
    // @Roles(UserRole.ADMIN)
    // @ApiOperation({ summary: 'ADMIN: Actualizar usuario por ID' })
    // updateUser(
    //     @Param('id', ParseUUIDPipe) id: string,
    //     @Body() updateUserDto: UpdateUserDto,
    //     @AuthUser() admin: UserPayload,
    // ) {
    //     return this.usersService.updateUser(id, updateUserDto, admin.userId);
    // }

    // @Delete(':id')
    // @UseGuards(RolesGuard)
    // @Roles(UserRole.ADMIN)
    // @ApiOperation({ summary: 'ADMIN: Eliminar usuario por ID' })
    // deleteUser(
    //     @Param('id', ParseUUIDPipe) id: string,
    //     @AuthUser() admin: UserPayload,
    // ) {
    //     return this.usersService.deleteUser(id, admin.userId);
    // }
}