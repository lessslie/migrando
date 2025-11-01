import { Module } from '@nestjs/common';
import { ComercianteController } from './comerciante.controller';
import { ComercianteService } from './comerciante.service';
import { ComercianteRepository } from './comerciante.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers: [ComercianteController],
    providers: [ComercianteService, ComercianteRepository, PrismaService],
    exports: [ComercianteService],
})
export class ComercianteModule {}
