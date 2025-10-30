// src/modules/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRepository } from './user.repository';
import { USER_REPOSITORY } from './user.repository.interface';

@Module({
    imports: [PrismaModule],
    controllers: [UsersController],
    providers: [
        UsersService,
        {
        provide: USER_REPOSITORY,
        useClass: UserRepository,
        },
    ],
    exports: [
        UsersService,
        {
        provide: USER_REPOSITORY,
        useClass: UserRepository,
        },
    ],
})
export class UsersModule {}
