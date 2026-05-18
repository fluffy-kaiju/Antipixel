import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EUserAccountStatus } from '../prisma/generated/enums';

@Injectable()
export class UsersModelService {

    constructor(private prisma: PrismaService) { }

    async registerUser(data: {
        userName: string,
        email: string,
        passwordHash: string
    }) {
        return await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    userName: data.userName,
                    email: data.email,
                    passwordHash: data.passwordHash,
                    status: EUserAccountStatus.NOOB,
                }
            });
            await tx.userStatusHistory.create({
                data: {
                    userId: user.id,
                    changeMadeByUserId: user.id,
                    status: EUserAccountStatus.NOOB,
                    reason: 'User registered'
                }
            })
            return user;
        });
    }

    async createEmailConfirmationCode(userId: number) {
        return this.prisma.emailConfirmationCode.create({
            data: {
                userId: userId,
            }
        })
    }

    async getEmailConfirmationCode(token: string) {
        return this.prisma.emailConfirmationCode.findUnique({
            where: {
                token: token,
            }
        })
    }

    async getEmailConfirmationCodeByUserId(userId: number) {
        return this.prisma.emailConfirmationCode.findUnique({
            where: {
                userId: userId,
            }
        })
    }

    async deleteAllEmailConfirmationCodeByUserId(userId: number) {
        return this.prisma.emailConfirmationCode.deleteMany({
            where: {
                userId: userId,
            }
        })
    }

    async deleteEmailConfirmationCode(token: string) {
        return this.prisma.emailConfirmationCode.delete({
            where: {
                token: token,
            }
        })
    }

    async updateEmailConfirmationStatus(userId: number, isVerified: boolean) {
        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                emailIsVerified: isVerified,
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

    async getUserLoginByUserName(userName: string) {
        return this.prisma.user.findUnique({
            where: {
                userName: userName
            },
            select: {
                userName: true,
                email: true,
                emailIsVerified: true,
                passwordHash: true
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
