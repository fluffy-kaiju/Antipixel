import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersModelService {

    constructor(private prisma: PrismaService) { }

    async registerUser(data: {
        userName: string,
        email: string,
        passwordHash: string
    }) {
        return await this.prisma.user.create({
            data: {
                userName: data.userName,
                email: data.email,
                passwordHash: data.passwordHash
            }
        })
    }

    async getById(userId: number) {
        return this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })
    };

    async getByUserName(userName: string) {
        return this.prisma.user.findUnique({
            where: {
                userName: userName
            }
        })
    };

    async getByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email: email
            }
        })
    };

}
