import { overridePrismaFilter } from '@db/db/prisma/prisma.filter';
import { UsersModelService } from '@db/db/users-model/users-model.service';
import { Injectable } from '@nestjs/common';
import { ERegisterError, RegisterConflictResponseDto } from '../dto/register.dto';

@Injectable()
export class AuthUserService {

    constructor(private readonly usersModel: UsersModelService) { }

    async registerUser(data: {
        userName: string,
        email: string,
        password: string
    }) {

        if (this.usersModel.getByUserName(data.userName) !== null) {
            throw new RegisterConflictResponseDto(ERegisterError.UserNameTaken);
        }

        if (this.usersModel.getByEmail(data.email) !== null) {
            throw new RegisterConflictResponseDto(ERegisterError.EmailTaken);
        }

        return this.usersModel.create({
            userName: data.userName,
            email: data.email,
            passwordHash: data.password//TODO CHANGE TO HASH
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
