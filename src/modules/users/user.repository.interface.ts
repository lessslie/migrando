/* eslint-disable @typescript-eslint/no-unused-vars */
// user.repository.interface.ts
import type { User, Prisma } from '@prisma/client';
import type { PaginationDto } from './dto/pagination.dto';
import type { UpdateProfileDto } from './dto/update-profile.dto';
import type { UpdateUserDto } from './dto/update-user.dto';

// Define el tipo de dato que devuelve findProfile (incluyendo las relaciones)
type UserWithRelations = Prisma.UserGetPayload<{
    include: {
        comerciante: true;
        fabricante: true;
        logistica: true;
        proveedor: true;
    }
}>;

// Define los campos que se seleccionan típicamente en las listas o perfiles
const userSelect = {
    id: true, email: true, firstName: true, lastName: true, role: true, 
    isActive: true, emailVerified: true, createdAt: true, updatedAt: true,
    comerciante: true, fabricante: true, logistica: true, proveedor: true,
};

export interface IUserRepository {

    // === MÉTODOS AÑADIDOS PARA AUTH SERVICE ===
    
    // Busca un usuario por email, incluyendo la contraseña hasheada (necesario para login).
    findByEmail(email: string): Promise<User | null>;

    // Crea un nuevo usuario
    create(data: Prisma.UserCreateInput): Promise<User>;

    // Método para login/registro con Google
    findOrCreateByGoogle(email: string, name: string, avatarUrl?: string): Promise<User>;

    // === MÉTODOS EXISTENTES PARA USER SERVICE ===

    // Busca un usuario con todas las relaciones (para el perfil/stats)
    findUserWithProfileData(userId: string): Promise<UserWithRelations | null>;

    // Actualiza solo los campos del perfil
    updateProfile(userId: string, data: UpdateProfileDto): Promise<Partial<User>>;

    // Obtiene una lista paginada de usuarios (para el Admin)
    findAll(
        where: Prisma.UserWhereInput, 
        skip: number, 
        take: number
    ): Promise<{ users: Partial<UserWithRelations>[]; totalCount: number }>;

    // Busca un usuario por ID (para el Admin)
    findById(id: string): Promise<Partial<UserWithRelations> | null>;

    // Actualiza un usuario (para el Admin)
    update(id: string, data: UpdateUserDto): Promise<Partial<User>>;

    // Elimina un usuario (para el Admin)
    delete(id: string): Promise<void>;
}

// Token de inyección
export const USER_REPOSITORY = 'IUserRepository';