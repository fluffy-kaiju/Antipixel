import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtModelService } from '../jwt/jwt-model.service';
import { AuthUserTokenEntity } from './dto/AuthUser.dto';

@Injectable()
export class AuthUserGuard implements CanActivate {
    private readonly logger = new Logger(AuthUserGuard.name);
    constructor(
        private readonly jwtService: JwtModelService,
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const token = this.extractAccessToken(req);

        this.logger.verbose(req.headers);

        if (!token) {
            throw new UnauthorizedException('Invalid Bearer token');
        }

        const verifiedTokenPayload = await this.jwtService.verifyToken<AuthUserTokenEntity>(token);

        if (!verifiedTokenPayload) {
            throw new UnauthorizedException('Invalid Bearer token');
        }

        req['user'] = verifiedTokenPayload;

        return true;
    }

    private extractAccessToken(req: Request): string | undefined {
        const [type, token] = req.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
