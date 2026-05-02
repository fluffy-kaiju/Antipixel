import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DbUserService } from './db-user.service';

@Module({
    imports: [PrismaModule],
    providers: [DbUserService],
    exports: [DbUserService]

})
export class DbUserModule { }
