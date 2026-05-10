import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as argon2 from "argon2";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    async hashPassword(plainPassword: string) {
        return await argon2.hash(plainPassword)
    }

    async verifyHashPassword(hashedPassword: string, plainPassword: string) {
        return await argon2.verify(hashedPassword, plainPassword);
    }

}
