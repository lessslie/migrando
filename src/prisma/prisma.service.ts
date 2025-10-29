// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    // No necesitamos el constructor explícito si la URL está en .env
    
    async onModuleInit() {
        let retries = 5;
        // Agregamos un try/catch para manejar el error final si falla después de los reintentos
        try {
            while (retries > 0) {
                try {
                    // Intenta la conexión
                    await this.$connect();
                    console.log('✅ Prisma connected to Render Postgres');
                    return; // Conexión exitosa, salir de la función
                } catch (err) {
                    retries -= 1;
                    if (retries === 0) {
                        // Si no quedan reintentos, lanza el error final para que NestJS lo capture
                        throw err; 
                    }
                    console.error(`❌ Prisma failed to connect. Retries left: ${retries}. Retrying in 5s...`);
                    // Espera 5 segundos antes del próximo intento
                    await new Promise(res => setTimeout(res, 5000)); 
                }
            }
        } catch (error) {
            // Este error será capturado por NestJS y detendrá la aplicación
            console.error("⛔ FATAL: Could not establish a connection to the database after multiple retries.", error.message);
            throw error;
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}