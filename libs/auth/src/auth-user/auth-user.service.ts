import { overridePrismaFilter } from '@db/db/prisma/prisma.filter';
import { UsersModelService } from '@db/db/users-model/users-model.service';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ERegisterError, RegisterConflictResponseDto, RegisterCreatedResponseEntity } from './dto/register.dto';

@Injectable()
export class AuthUserService {

    private readonly logger = new Logger(AuthUserService.name);

    constructor(
        private readonly usersModel: UsersModelService,
        private readonly authService: AuthService,
    ) { }

    async registerUser(data: {
        userName: string,
        email: string,
        password: string
    }) {

        if (await this.usersModel.getByUserName(data.userName) !== null) {
            this.logger.debug(ERegisterError.UserNameTaken);
            throw new RegisterConflictResponseDto(ERegisterError.UserNameTaken);
        }

        if (await this.usersModel.getByEmail(data.email) !== null) {
            this.logger.debug(ERegisterError.EmailTaken);
            throw new RegisterConflictResponseDto(ERegisterError.EmailTaken);
        }

        const passwordHash = await this.authService.hashPassword(data.password)
            .catch(err => {
                this.logger.error(err);
                throw new InternalServerErrorException(ERegisterError.HashingFailed);

            });

        return this.usersModel.registerUser({
            userName: data.userName,
            email: data.email,
            passwordHash: passwordHash
        })
            .catch((e) =>
                overridePrismaFilter(e, (err) => {
                    if (err.code === 'P2002') {
                        throw new RegisterConflictResponseDto(ERegisterError.UnknownConlfict);
                    }
                    throw e;
                })
            )
    }
}
