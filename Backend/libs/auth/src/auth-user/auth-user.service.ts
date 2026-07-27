import { overridePrismaFilter } from '@db/db/prisma/prisma.filter';
import { UsersModelService } from '@db/db/users-model/users-model.service';
import { GoneException, Injectable, InternalServerErrorException, Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ERegisterError, RegisterConflictResponseEntity, RegisterCreatedResponseEntity, ResendVerifyEmailAlreadyVerify, ResendVerifyEmailNotFound, ResendVerifyEmailResponseEntity, ResendVerifyEmailWait, VerifyEmailExpiredOrNotFoundResponseEntity, VerifyEmailOkResponseEntity } from './dto/register.dto';
import { AuthUserNotifyService } from './auth-user-notify.service';
import { LoginEmailNotVerifiedError, LoginFailedError, LoginResponseEntity } from './dto/sing-in.dto';
import { JwtModelService } from '../jwt/jwt-model.service';
import { AuthUserTokenEntity } from './dto/AuthUser.dto';
import { EUserAccountStatus } from '@db/db/prisma/generated/enums';

@Injectable()
export class AuthUserService implements OnModuleInit {

    private readonly logger = new Logger(AuthUserService.name);

    constructor(
        private readonly usersModel: UsersModelService,
        private readonly authService: AuthService,
        private readonly authUserNotifyService: AuthUserNotifyService,
        private readonly jwtModelService: JwtModelService,
    ) { }

    /**/
    /* Check if the system user is setup. Needed for system action history.
     */
    async onModuleInit() {

        this.logger.verbose(`Check if system user exist in db`);
        const user = await this.usersModel.getById(this.usersModel.SYSTEM_ID);
        if (user !== null) {
            if (user.status !== EUserAccountStatus.SYSTEM) {
                this.logger.fatal(`System user doesn't have the right account status!!!`);
                this.logger.fatal(`Current ${user.status} vs expected ${EUserAccountStatus.SYSTEM}`);
                this.logger.verbose(user);
                process.exit(1);
            }
            this.logger.verbose(`Syster user exist`);
            this.logger.verbose(user);
            return;
        }
        this.logger.verbose(`System user with id ${this.usersModel.SYSTEM_ID} doesn't, try to create it`);
        const sys_u = await this.usersModel.createSystemUser()
            .catch((e) => {
                this.logger.fatal(`Failed to create the system user!!!`)
                process.exit(1);
            })
        this.logger.verbose(`System user created!`);
        this.logger.verbose(sys_u);
    };

    async loginUser(data: {
        userName: string,
        password: string,
    }) {

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

            if (await this.usersModel.hasEmailVerified(code.userId)) {
                throw new ResendVerifyEmailAlreadyVerify();
            }

            const createdAt = code.createdAt.toTemporalInstant();
            const expireAt = createdAt.add({ seconds: code.TTL_sec });
            const now = Temporal.Now.instant();

            if (Temporal.Instant.compare(now, expireAt) < 0) {
                const remaining = Math.ceil(
                    now.until(expireAt).total({ unit: 'second' })
                );
                throw new ResendVerifyEmailWait(remaining);
            }

        }

        await this.usersModel.deleteAllEmailConfirmationCodeByUserId(user.id);
        const emailValidationCode = await this.usersModel.createEmailConfirmationCode(user.id);
        await this.authUserNotifyService.sendEmailConfirmationURL(
            user.email,
            user.userName,
            emailValidationCode.token,
        )
        return new ResendVerifyEmailResponseEntity();
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
