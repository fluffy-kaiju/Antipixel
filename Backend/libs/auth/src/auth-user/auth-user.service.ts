import { overridePrismaFilter } from '@db/db/prisma/prisma.filter';
import { UsersModelService } from '@db/db/users-model/users-model.service';
import { GoneException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ERegisterError, RegisterConflictResponseEntity, RegisterCreatedResponseEntity, ResendVerifyEmailNotFound, ResendVerifyEmailWait, VerifyEmailExpiredOrNotFoundResponseEntity, VerifyEmailOkResponseEntity } from './dto/register.dto';
import { AuthUserNotifyService } from './auth-user-notify.service';
import { LoginEmailNotVerifiedError, LoginFailedError, LoginResponseEntity } from './dto/sing-in.dto';
import { JwtModelService } from '../jwt/jwt-model.service';
import { AuthUserTokenEntity } from './dto/AuthUser.dto';

@Injectable()
export class AuthUserService {

    private readonly logger = new Logger(AuthUserService.name);

    constructor(
        private readonly usersModel: UsersModelService,
        private readonly authService: AuthService,
        private readonly authUserNotifyService: AuthUserNotifyService,
        private readonly jwtModelService: JwtModelService,
    ) { }

    async loginUser(data: {
        userName: string,
        password: string,
    }) {

        // TODO     - check if user
        //          - check if mail verified
        //          - check password hash
        //          - send client token

        const user = await this.usersModel.getUserLoginByUserName(data.userName)

        if (user === null) {
            throw new LoginFailedError();
        }

        if (!user.emailIsVerified) {
            throw new LoginEmailNotVerifiedError();
        }

        if (! await this.authService.verifyHashPassword(user.passwordHash, data.password)) {
            throw new LoginFailedError();
        }

        const token_payload = new AuthUserTokenEntity({
            id: user.id,
            userName: user.userName,
        });
        const access_token = await this.jwtModelService.signToken(token_payload, AuthUserService.name);

        return new LoginResponseEntity({ access_token: access_token })
    }

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
                this.logger.fatal(err);
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
        return new RegisterCreatedResponseEntity(newUser);
    }

    async resendEmailVerify(email: string) {

        const user = await this.usersModel.getByEmail(email);
        if (user === null) {
            throw new ResendVerifyEmailNotFound();
        }

        const code = await this.usersModel.getLastEmailConfirmationCodeByUserId(user.id);

        if (code !== null) {

            const createdAt = code.createdAt.toTemporalInstant();
            const expireAt = createdAt.add({ seconds: code.TTL_sec });
            const now = Temporal.Now.instant();

            if (Temporal.Instant.compare(now, expireAt) < 0) {
                const remaining = Math.ceil(
                    now.until(expireAt).total({ unit: 'second' })
                );
                throw new ResendVerifyEmailWait(remaining);
            }

            await this.usersModel.deleteAllEmailConfirmationCodeByUserId(user.id);
            const emailValidationCode = await this.usersModel.createEmailConfirmationCode(user.id);
            await this.authUserNotifyService.sendEmailConfirmationURL(
                user.email,
                user.userName,
                emailValidationCode.token,
            )
        }
    }

    async verifyEmail(token: string) {
        const code = await this.usersModel.getEmailConfirmationCode(token);
        if (code === null) throw new GoneException(new VerifyEmailExpiredOrNotFoundResponseEntity());

        const createdAt = code.createdAt.toTemporalInstant();
        const expireAt = createdAt.add({ seconds: code.TTL_sec });

        if (Temporal.Instant.compare(Temporal.Now.instant(), expireAt) > 0) {
            throw new GoneException(new VerifyEmailExpiredOrNotFoundResponseEntity);
        }

        await this.usersModel.updateEmailConfirmationStatus(code.userId, true);
        await this.usersModel.deleteAllEmailConfirmationCodeByUserId(code.userId);

        return new VerifyEmailOkResponseEntity();
    }

}
