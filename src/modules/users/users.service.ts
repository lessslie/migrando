/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { UserRepository } from './user.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: UserRepository) {}

    // =========================================================================
    // PERFIL DEL USUARIO AUTENTICADO

    async findProfile(userId: string) {
        const user = await this.userRepository.findUserWithProfileData(userId);
        if (!user) throw new NotFoundException('Usuario no encontrado.');

        const profile = user.comerciante || user.fabricante || user.logistica || user.proveedor;

        return { ...user, profile };
    }

    async updateProfile(userId: string, data: UpdateProfileDto) {
        const exists = await this.userRepository.findById(userId);
        if (!exists) throw new NotFoundException('Usuario no encontrado.');

        return this.userRepository.updateProfile(userId, data);
    }

    // =========================================================================
    // ADMIN

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

        if (dto.role) where.role = dto.role as UserRole;

        const { users, totalCount } = await this.userRepository.findAll(where, skip, dto.limit);

        return {
        users,
        pagination: {
            page: dto.page,
            limit: dto.limit,
            totalCount,
            totalPages: Math.ceil(totalCount / dto.limit),
        },
        };
    }

    async findUserById(id: string) {
        const user = await this.userRepository.findById(id);
        if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
        return user;
    }

    async updateUser(id: string, data: UpdateUserDto, updatedBy: string) {
        const exists = await this.userRepository.findById(id);
        if (!exists) throw new NotFoundException('Usuario no encontrado.');

        return this.userRepository.update(id, data);
    }

    async deleteUser(id: string, deletedBy: string) {
        try {
        await this.userRepository.delete(id);
        return { message: `Usuario ${id} eliminado por Admin ${deletedBy}` };
        } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
        }
        throw new BadRequestException('Error al eliminar el usuario.');
        }
    }

    // =========================================================================
    // ESTADÍSTICAS

    async getUserStats(userId: string) {
        const user = await this.userRepository.findUserWithProfileData(userId);
        if (!user) throw new NotFoundException('Usuario no encontrado.');

        const accountAgeDays = Math.floor(
        (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24),
        );

        return {
        role: user.role,
        accountAge: accountAgeDays,
        stats: {}, // Aquí puedes agregar estadísticas según el rol
        };
    }
}
