import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModelService } from './users-model.service';

@Module({
    imports: [PrismaModule],
    providers: [UsersModelService],
    exports: [UsersModelService]
})
export class UsersModelModule { }
