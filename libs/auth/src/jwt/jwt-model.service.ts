import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { JsonWebTokenError, JwtService, JwtSignOptions, JwtVerifyOptions, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class JwtModelService {
    private readonly logger = new Logger(JwtModelService.name);

    constructor(private readonly jwtService: JwtService) { }

    private readonly signOptions: JwtSignOptions = {
        expiresIn: '24h',
    }

    private readonly verifyOptions: JwtVerifyOptions = {}

    async signToken<T extends object>(payload: T, issuer: string): Promise<string> {
        return this.jwtService.signAsync<T>({ ...payload }, { ...this.signOptions, issuer: issuer })
            .catch((e) => {
                this.logger.error(e);
                throw new InternalServerErrorException('Failed to sing jwt token, check logs')
            })
    }

    async verifyToken<T extends object>(token: string): Promise<T | null> {
        return this.jwtService.verifyAsync<T>(token, this.verifyOptions)
            .then((payload: T) => {
                this.logger.verbose(payload);
                return payload;
            })
            .catch((err) => {
                if (!(err instanceof JsonWebTokenError)) {
                    this.logger.fatal(err);
                    throw new InternalServerErrorException('Undefined error when trying to verify jwt token, check logs');
                }
                this.logger.debug(err.name);
                return null;
            })
    }
}
