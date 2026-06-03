import { BeforeApplicationShutdown, Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';
import { OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, BeforeApplicationShutdown {
    constructor() {
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL as string,
        });
        super({ adapter })
    }

    private readonly logger = new Logger(PrismaService.name);

    async onModuleInit() {
        return this.$connect()
            .then(async () => {
                await this.$queryRaw`SELECT 1`;

                this.logger.verbose('Successfully connected to the db');
            })
            .catch(async (err) => {
                this.logger.fatal('Db connection failed!!')
                throw err;
            })
    }

    async beforeApplicationShutdown() {
        return await this.$disconnect()
            .then(() => {
                this.logger.verbose(`Successfully disconnected the db`);
            })
    }
}
