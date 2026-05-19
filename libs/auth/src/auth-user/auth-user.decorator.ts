import { applyDecorators, createParamDecorator, ExecutionContext, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthUserTokenEntity } from './dto/AuthUser.dto';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthUserGuard } from './auth-user.guard';

export const AuthUser = createParamDecorator(
    (key: keyof AuthUserTokenEntity | undefined, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();
        const user = req?.user as AuthUserTokenEntity;

        return key ? user?.[key] : user;
    }
)

export function Auth() {
    return applyDecorators(
        UseGuards(AuthUserGuard),
        ApiBearerAuth('JWT-user-auth'),
        ApiUnauthorizedResponse(),
    )
}
