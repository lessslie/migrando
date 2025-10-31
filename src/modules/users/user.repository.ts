import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IUserRepository } from './user.repository.interface';
import type { UpdateProfileDto } from './dto/update-profile.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { Prisma, User } from '@prisma/client';

const DEFAULT_SELECT = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    phone: true,
    avatar: true,
    role: true,
    isActive: true,
    emailVerified: true,
    createdAt: true,
    updatedAt: true,
};

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService) {}

    // =========================================================================
    // MÉTODOS PARA AUTH SERVICE

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
  }

    async findOrCreateByGoogle(email: string, name: string, avatar?: string) {
        const existing = await this.findByEmail(email);
        if (existing) return existing;

        const [firstName, ...rest] = name.split(' ');
        const lastName = rest.join(' ');

        return this.prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                avatar,
                password: '', // no password for OAuth
                emailVerified: true,
                role: 'COMERCIANTE', // por defecto en Fabriconnect
            },
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        // Devuelve usuario sin la contraseña
        const result = await this.prisma.user.create({
        data,
        select: DEFAULT_SELECT,
        });
        return result as unknown as User;
    }

    // =========================================================================
    // MÉTODOS PARA USER SERVICE

    async findUserWithProfileData(userId: string) {
        return this.prisma.user.findUnique({
        where: { id: userId },
        include: {
            comerciante: true,
            fabricante: true,
            logistica: true,
            proveedor: true,
        },
        });
    }

    async updateProfile(userId: string, data: UpdateProfileDto) {
        return this.prisma.user.update({
        where: { id: userId },
        data,
        select: DEFAULT_SELECT,
        });
    }

    async findAll(where: Prisma.UserWhereInput, skip: number, take: number) {
        const [usersData, totalCount] = await this.prisma.$transaction([
        this.prisma.user.findMany({
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            select: {
            ...DEFAULT_SELECT,
            comerciante: true,
            fabricante: true,
            logistica: true,
            proveedor: true,
            },
            where,
        }),
        this.prisma.user.count({ where }),
        ]);
        return { users: usersData, totalCount };
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
        where: { id },
        select: {
            ...DEFAULT_SELECT,
            comerciante: true,
            fabricante: true,
            logistica: true,
            proveedor: true,
        },
        });
    }

    async update(id: string, data: UpdateUserDto | { password?: string }) {
        return this.prisma.user.update({
        where: { id },
        data,
        select: DEFAULT_SELECT,
        });
    }

    async delete(id: string) {
        await this.prisma.user.delete({ where: { id } });
    }
}
