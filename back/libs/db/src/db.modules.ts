import { Module } from '@nestjs/common';
import { DbUserModule } from './db-user/db-user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
    imports: [DbUserModule, PrismaModule],

})
export class DatabasesModule { }
