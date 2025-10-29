import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, UserRole } from '@prisma/client';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(private readonly prisma: PrismaService) {}

    // =========================================================================
    // RUTAS DE PERFIL DEL USUARIO (GET/PUT /profile)

    async findProfile(userId: string) {
        const userData = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
            isActive: true,
            emailVerified: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            comerciante: true,
            fabricante: true,
            logistica: true,
            proveedor: true,
        }
        });

        if (!userData) {
        throw new NotFoundException('User not found');
        }

        // Lógica para determinar el perfil sectorial
        const profileData = userData.comerciante || userData.fabricante || userData.logistica || userData.proveedor;

        return {
        ...userData,
        profile: profileData,
        };
    }

    async updateProfile(userId: string, data: UpdateProfileDto) {
        const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: data,
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
            isActive: true,
            emailVerified: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        }
        });

        this.logger.log(`User profile updated: ${userId}`);
        return updatedUser;
    }

    // =========================================================================
    // RUTAS DE NOTIFICACIONES

    async getNotifications(userId: string, page: number, limit: number) {
        const skip = (page - 1) * limit;

        const [notifications, totalCount] = await this.prisma.$transaction([
        this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        this.prisma.notification.count({ where: { userId } }),
        ]);

        return {
        notifications,
        pagination: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
        },
        };
    }

    async markNotificationAsRead(userId: string, notificationId: string) {
        const notification = await this.prisma.notification.findUnique({
        where: { id: notificationId },
        });

        if (!notification) {
        throw new NotFoundException('Notification not found');
        }

        if (notification.userId !== userId) {
        // Forbidden (403) si intenta marcar la notificación de otro usuario
        throw new ForbiddenException('Access denied to this notification');
        }

        // Utiliza un update seguro para solo cambiar el campo si no está leído
        const updated = await this.prisma.notification.update({
        where: { id: notificationId, read: false }, // Condición para evitar update innecesario
        data: { read: true },
        });
        
        return updated;
    }

    async markAllNotificationsAsRead(userId: string) {
        const { count } = await this.prisma.notification.updateMany({
        where: { 
            userId: userId,
            read: false,
        },
        data: { read: true },
        });
        
        return { count };
    }

    // =========================================================================
    // RUTAS DE ESTADÍSTICAS

    async getUserStats(userId: string) {
        const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
            comerciante: true,
            fabricante: true,
            logistica: true,
            proveedor: true,
        }
        });

        if (!user) {
        throw new NotFoundException('User not found');
        }

        let stats: any = {};

        // Mapeo de estadísticas (simplificado para coincidir con la lógica original)
        switch (user.role) {
        case UserRole.COMERCIANTE:
            stats = {
            // totalOrders: user.comerciante?.totalOrders ?? 0,
            // totalRevenue: user.comerciante?.totalRevenue ?? 0,
            // averageRating: user.comerciante?.averageRating ?? 0,
            // reviewCount: user.comerciante?.reviewCount ?? 0,
            };
            break;
        // ... otros roles (FABRICANTE, LOGISTICA, PROVEEDOR)
        // Nota: Los campos totalOrders, totalRevenue, etc., deben existir en tus modelos sectoriales de Prisma.
        }

        const accountAgeDays = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));

        return {
        stats,
        role: user.role,
        accountAge: accountAgeDays,
        };
    }

    // =========================================================================
    // RUTAS DE ADMINISTRACIÓN (requieren ADMIN)

    async findAllUsers(dto: PaginationDto) {
        const skip = (dto.page - 1) * dto.limit;
        
        const where: Prisma.UserWhereInput = {};

        if (dto.search) {
        where.OR = [
            { firstName: { contains: dto.search, mode: 'insensitive' } },
            { lastName: { contains: dto.search, mode: 'insensitive' } },
            { email: { contains: dto.search, mode: 'insensitive' } },
        ];
        }

        if (dto.role) {
        where.role = dto.role as UserRole;
        }

        const [usersData, totalCount] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                skip,
                take: dto.limit,
                orderBy: { createdAt: 'desc' },
                select: { 
                    id: true, email: true, firstName: true, lastName: true, role: true, 
                    isActive: true, emailVerified: true, createdAt: true, updatedAt: true,
                    comerciante: true, fabricante: true, logistica: true, proveedor: true,
                },
                where
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
        users: usersData,
        pagination: {
            page: dto.page,
            limit: dto.limit,
            totalCount,
            totalPages: Math.ceil(totalCount / dto.limit),
        },
        };
    }

    async findUserById(id: string) {
        const user = await this.prisma.user.findUnique({
        where: { id },
        select: { 
            id: true, email: true, firstName: true, lastName: true, role: true, 
            isActive: true, emailVerified: true, createdAt: true, updatedAt: true,
            comerciante: true, fabricante: true, logistica: true, proveedor: true,
        },
        });

        if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
        }

        return user;
    }
    
    async updateUser(id: string, data: UpdateUserDto, updatedBy: string) {
        const updatedUser = await this.prisma.user.update({
        where: { id },
        data: data,
        select: { 
            id: true, email: true, firstName: true, lastName: true, role: true, 
            isActive: true, emailVerified: true, createdAt: true, updatedAt: true,
        },
        });

        this.logger.warn(`User ${id} updated by Admin ${updatedBy}`);
        return updatedUser;
    }

    async deleteUser(id: string, deletedBy: string) {
        try {
            await this.prisma.user.delete({ where: { id } });
            this.logger.warn(`User ${id} permanently deleted by Admin ${deletedBy}`);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException(`User with ID ${id} not found.`);
            }
            throw error;
        }
    }
}