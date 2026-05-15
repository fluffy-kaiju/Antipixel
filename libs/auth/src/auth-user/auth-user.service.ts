import { overridePrismaFilter } from '@db/db/prisma/prisma.filter';
import { UsersModelService } from '@db/db/users-model/users-model.service';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ERegisterError, RegisterConflictResponseEntity, RegisterCreatedResponseEntity, VerifyEmailErrorResponseEntity, VerifyEmailExpiredOrNotFoundResponseEntity, VerifyEmailOkResponseEntity } from './dto/register.dto';
import { AuthUserNotifyService } from './auth-user-notify.service';

@Injectable()
export class AuthUserService {

    private readonly logger = new Logger(AuthUserService.name);

    constructor(
        private readonly usersModel: UsersModelService,
        private readonly authService: AuthService,
        private readonly authUserNotifyService: AuthUserNotifyService,
    ) { }

    async registerUser(data: {
        userName: string,
        email: string,
        password: string
    }) {

        if (await this.usersModel.getByUserName(data.userName) !== null) {
            this.logger.debug(ERegisterError.UserNameTaken);
            throw new RegisterConflictResponseEntity(ERegisterError.UserNameTaken);
        }

        if (await this.usersModel.getByEmail(data.email) !== null) {
            this.logger.debug(ERegisterError.EmailTaken);
            throw new RegisterConflictResponseEntity(ERegisterError.EmailTaken);
        }

        const passwordHash = await this.authService.hashPassword(data.password)
            .catch(err => {
                this.logger.error(err);
                throw new InternalServerErrorException(ERegisterError.HashingFailed);

            });

        const newUser = await this.usersModel.registerUser({
            userName: data.userName,
            email: data.email,
            passwordHash: passwordHash,
        })
            .catch((e) =>
                overridePrismaFilter(e, (err) => {
                    if (err.code === 'P2002') {
                        throw new RegisterConflictResponseEntity(ERegisterError.Unknown);
                    }
                    throw e;
                })
            );

        const emailValidationCode = await this.usersModel.createEmailConfirmationCode(newUser.id);

        await this.authUserNotifyService.sendEmailConfirmationURL(
            data.email,
            data.userName,
            emailValidationCode.token,
        )
            .catch((e) => {
                this.logger.fatal(e);
                throw new InternalServerErrorException(ERegisterError.FailedToSendVerificationMail)
            })

        return newUser;
    }

    async verifyEmail(token: string) {
        const res = await this.usersModel.getEmailConfirmationCode(token);
        if (res === null) return new VerifyEmailExpiredOrNotFoundResponseEntity();
        const start = Temporal;

        return new VerifyEmailOkResponseEntity();
    }
}
