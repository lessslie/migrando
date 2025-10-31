import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { UpdateProfileDto } from './dto/update-profile.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { Prisma } from '@prisma/client';

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
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    // =========================================================================
    // AUTH

    async findByEmail(email: string) {
        return this.prisma.user.findFirst({
        where: { email, deletedAt: null },
        });
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
            password: '',
            emailVerified: true,
            role: 'COMERCIANTE',
        },
        select: DEFAULT_SELECT,
        });
    }

    async create(
        data: Prisma.UserCreateInput,
        ): Promise<Prisma.UserGetPayload<{ select: typeof DEFAULT_SELECT }>> {
        return this.prisma.user.create({
            data,
            select: DEFAULT_SELECT,
        });
    }

  // =========================================================================
  // USERS SERVICE

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

    async findById(id: string) {
        return this.prisma.user.findUnique({
        where: { id },
        include: {
            comerciante: true,
            fabricante: true,
            logistica: true,
            proveedor: true,
        },
        });
    }

    async findAll(where: Prisma.UserWhereInput, skip: number, take: number) {
        const baseFilter: Prisma.UserWhereInput = {
        ...where,
        deletedAt: null,
        };

        const [users, totalCount] = await this.prisma.$transaction([
        this.prisma.user.findMany({
            skip,
            take,
            where: baseFilter,
            orderBy: { createdAt: 'desc' },
            include: {
            comerciante: true,
            fabricante: true,
            logistica: true,
            proveedor: true,
            },
        }),
        this.prisma.user.count({ where: baseFilter }),
        ]);

        return { users, totalCount };
    }

    async updateProfile(userId: string, data: UpdateProfileDto) {
        return this.prisma.user.update({
        where: { id: userId },
        data,
        select: DEFAULT_SELECT,
        });
    }

    async update(id: string, data: UpdateUserDto | { password?: string }) {
        return this.prisma.user.update({
        where: { id },
        data,
        select: DEFAULT_SELECT,
        });
    }

    // =========================================================================
    // SOFT DELETE

    async delete(id: string) {
        const exists = await this.findById(id);
        if (!exists) throw new NotFoundException('Usuario no encontrado.');

        await this.prisma.user.update({
        where: { id },
        data: { deletedAt: new Date(), isActive: false },
        });
    }

    async restore(id: string) {
        const exists = await this.findById(id);
        if (!exists) throw new NotFoundException('Usuario no encontrado.');

        await this.prisma.user.update({
        where: { id },
        data: { deletedAt: null, isActive: true },
        });
    }
}
