import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EUserAccountStatus } from '../prisma/generated/enums';

@Injectable()
export class UsersModelService {

    constructor(private prisma: PrismaService) { }

    readonly SYSTEM_ID = 1;
    readonly SYSTEM_USERNAME = 'SYSTEM';
    readonly EMAIL_CONFIRMATION_TOKEN_TTL = 60 * 5;

    async createSystemUser() {
        return await this.prisma.user.create({
            data: {
                id: this.SYSTEM_ID,
                userName: this.SYSTEM_USERNAME,
                email: 'system@system.fake',
                passwordHash: '===NOPASS===',
                status: EUserAccountStatus.SYSTEM,
                accountHistory: {
                    create: {
                        changeMadeByUserId: this.SYSTEM_ID,
                        status: EUserAccountStatus.SYSTEM,
                        reason: 'System user created by system',
                    }
                }
            }
        });
    };

    async registerUser(data: {
        userName: string,
        email: string,
        passwordHash: string
    }) {
        return await this.prisma.user.create({
            data: {
                userName: data.userName,
                email: data.email,
                passwordHash: data.passwordHash,
                status: EUserAccountStatus.NOOB,
                accountHistory: {
                    create: {
                        changeMadeByUserId: this.SYSTEM_ID,
                        status: EUserAccountStatus.NOOB,
                        reason: 'User registered'
                    }
                }
            },
        });
    }

    async createEmailConfirmationCode(userId: number) {
        return this.prisma.emailConfirmationCode.create({
            data: {
                userId: userId,
                TTL_sec: this.EMAIL_CONFIRMATION_TOKEN_TTL,
            }
        });
    }

    async getEmailConfirmationCode(token: string) {
        return this.prisma.emailConfirmationCode.findUnique({
            where: {
                token: token,
            }
        });
    }

    async getEmailConfirmationCodeByUserId(userId: number) {
        return this.prisma.emailConfirmationCode.findFirst({
            where: {
                userId: userId,
            }
        });
    }

    async getLastEmailConfirmationCodeByUserId(userId: number) {
        return this.prisma.emailConfirmationCode.findFirst({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc'
            },
        });
    }

    async deleteAllEmailConfirmationCodeByUserId(userId: number) {
        return this.prisma.emailConfirmationCode.deleteMany({
            where: {
                userId: userId,
            }
        });
    }

    async deleteEmailConfirmationCode(token: string) {
        return this.prisma.emailConfirmationCode.delete({
            where: {
                token: token,
            }
        });
    }

    async updateEmailConfirmationStatus(userId: number, isVerified: boolean) {
        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                emailIsVerified: isVerified,
                status: EUserAccountStatus.PRO,
                accountHistory: {
                    create: {
                        reason: 'User verified his Email',
                        status: EUserAccountStatus.PRO,
                        changeMadeBy: {
                            connect: {
                                id: this.SYSTEM_ID,
                            }
                        }
                    }
                }
            }
        });
    }

    async getById(userId: number) {
        return this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
    };

    async getByUserName(userName: string) {
        return this.prisma.user.findUnique({
            where: {
                userName: userName
            }
        });
    };

    async getUserLoginByUserName(userName: string) {
        return this.prisma.user.findUnique({
            where: {
                userName: userName
            },
            select: {
                id: true,
                userName: true,
                email: true,
                emailIsVerified: true,
                passwordHash: true
            }
        });
    }

    async getByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email: email
            }
        });
    }

    async hasEmailVerified(id: number) {
        return this.prisma.user.findUnique({
            where: {
                id: id,
            },
            select: {
                emailIsVerified: true,
            }
        }).then((elem) => elem?.emailIsVerified ?? false);
    }

    async updateStatus(userId: number, status: EUserAccountStatus, reason: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                status: status,
                accountHistory: {
                    create: {
                        status: status,
                        reason: reason,
                        changeMadeBy: {
                            connect: {
                                id: userId,
                            }
                        }
                    }
                }
            }
        });
    }

}
