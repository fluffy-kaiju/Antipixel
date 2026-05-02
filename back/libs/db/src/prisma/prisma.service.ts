import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';
import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        //TODO change name
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL as string,
        });
        super({ adapter })
    }
    async onModuleInit() {
        await this.$connect()
    }

    async onModuleDestroy() {
        await this.$disconnect()
    }
}
