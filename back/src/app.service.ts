import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
    constructor(private prisma: PrismaService) {

    }
    getHello(): string {
        this.prisma.user.create({
            data: {
                userName: "test"
            }
        })
        return 'Hello World!';
    }
}
