import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { JsonWebTokenError, JwtService, JwtSignOptions, TokenExpiredError } from '@nestjs/jwt';

export interface VerificationEmailToken {
    email: string;
}

type EmailTokenResult =
    | { status: 'ok'; decoded: VerificationEmailToken }
    | { status: 'expired'; decoded: null }
    | { status: 'invalid'; decoded: null };

@Injectable()
export class JwtModelService {
    private readonly logger = new Logger(JwtModelService.name);

    constructor(private readonly jwtService: JwtService) { }


    // Email

    private readonly emailTokenOptions: JwtSignOptions = { expiresIn: '15m' };

    async generateVerificationEmailToken(data: VerificationEmailToken): Promise<string> {
        return this.jwtService
            .signAsync({ email: data.email }, this.emailTokenOptions)
            .catch((e) => {
                this.logger.fatal('Failed to sign verification email token!', e);
                throw new InternalServerErrorException('Failed to sign verification email token!');
            });
    }

    async verifyVerificationEmailToken(token: string): Promise<EmailTokenResult> {
        try {
            const decoded = await this.jwtService.verifyAsync<VerificationEmailToken>(token);
            return { status: 'ok', decoded };
        } catch (e) {
            if (e instanceof TokenExpiredError) return { status: 'expired', decoded: null };
            if (e instanceof JsonWebTokenError) return { status: 'invalid', decoded: null };

            this.logger.error('Unexpected error verifying email token', e);
            throw new InternalServerErrorException(e);
        }
    }
}
